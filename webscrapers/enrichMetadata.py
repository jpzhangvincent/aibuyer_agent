import os
import json
import subprocess
from openai import OpenAI
from bs4 import BeautifulSoup
import re
import sys
from datetime import datetime
from dotenv import load_dotenv


# Directory containing the JSON files
output_folder = 'output'

# Function to fetch HTML content using curl
def fetch_html(url):

    headers = {
        "accept-language": "en-US,en;q=0.9",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "accept-encoding": "gzip, deflate, br"
    }

    # Create the curl command with headers
    curl_command = [
        "curl",
        url,
        "--compressed"
    ]
    
    for header, value in headers.items():
        curl_command.extend(["-H", f"{header}: {value}"])

    # Execute the curl command and capture the output
    result = subprocess.run(curl_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    if result.returncode != 0:
        raise Exception(f"Curl command failed with error: {result.stderr}")

    return result.stdout

# Function to parse HTML and extract text using Beautiful Soup
def filter_html_content(html):
    soup = BeautifulSoup(html, 'html.parser')

    # Extract everything inside <script id="__NEXT_DATA__" type="application/json">
    script_tag = soup.find('script', id='__NEXT_DATA__', type='application/json')
    if script_tag:
        script_content = script_tag.string
    else:
        script_content = "Couldn't find the script tag with id '__NEXT_DATA__' and type 'application/json'."

    return script_content


def format_data(data, fields=None, chunk_size=131072):
    load_dotenv()
    # Instantiate the OpenAI client
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

    # Assign default fields if not provided
    if fields is None:
        fields = ["Address", "Real Estate Agency", "Price", "Beds", "Baths", "Sqft", "Home Type", "Listing Age", "Picture of home URLs", "Listing URL", "Schools"]

    # Define system message content
    system_message = f"""You are an intelligent text extraction and conversion assistant. Your task is to extract structured information 
    from the given text and convert it into a pure JSON format. The JSON should contain only the structured data extracted from the text, 
    with no additional commentary, explanations, or extraneous information. 
    You could encounter cases where you can't find the data of the fields you have to extract or the data will be in a foreign language.
    Please process the following text and provide the output in pure JSON format with no words before or after the JSON:"""

    # Chunk the data if it exceeds the chunk size
    def chunk_text(text, size):
        return [text[i:i + size] for i in range(0, len(text), size)]
    data_chunks = chunk_text(data, chunk_size)
    print(f"number of datachunks = {len(data_chunks)}")

    # Initialize a list to collect results
    responses = []

    # Process each chunk
    for i, chunk in enumerate(data_chunks):
        user_message = f"Extract the following information from the provided text chunk {i + 1}/{len(data_chunks)}:\nPage content:\n\n{chunk}\n\nInformation to extract: {fields}"

        response = client.chat.completions.create(
            model="gpt-4o",
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "system",
                    "content": system_message
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ]
        )

        # Check if the response contains the expected data
        if response and response.choices:
            formatted_data = response.choices[0].message.content.strip()
            print(f"Formatted data received from API for chunk {i + 1}: {formatted_data}")
            responses.append(formatted_data)
        else:
            raise ValueError("The OpenAI API response did not contain the expected choices data.")

    # Combine all responses using the OpenAI API
    concatenated_message = f"Consolidate the following JSON responses into a single unified JSON object:\n\n{responses}\n\nInformation to extract: {fields}\n\nLimit the number of Picture of home URLs to 10"
    final_response = client.chat.completions.create(
        model="gpt-4o",
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": system_message
            },
            {
                "role": "user",
                "content": concatenated_message
            }
        ]
    )

    # Check if the final response contains the expected data
    if final_response and final_response.choices:
        final_formatted_data = final_response.choices[0].message.content.strip()
        print(f"Final formatted data received from API: {final_formatted_data}")

        try:
            final_parsed_json = json.loads(final_formatted_data)
        except json.JSONDecodeError as e:
            print(f"JSON decoding error for final response: {e}")
            print(f"Formatted data that caused the error: {final_formatted_data}")
            raise ValueError("The final formatted data could not be decoded into JSON.")
    else:
        raise ValueError("The OpenAI API response did not contain the expected choices data.")

    return final_parsed_json
# Function to sanitize the URL to create a valid filename
def sanitize_filename(url):
    return re.sub(r'[^\w\-_. ]', '_', url)

# Function to process a single JSON file
def process_file(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
        listings = data.get("listings", [])
        for listing in listings:
            url = listing.get("Listing URL")
            if url:
                html_content = fetch_html(url)
                save_raw_data(html_content, url)
                try:
                    text_content = filter_html_content(html_content)
                    sanitized_filename = sanitize_filename(url) + '.txt'
                    output_file_path = os.path.join(output_folder, sanitized_filename)
                    with open(output_file_path, 'w', encoding='utf-8') as f:
                        formatted_data = format_data(text_content)
                        json.dump(formatted_data, f, indent=4)
                    print(f"Formatted data saved to {output_file_path}")
                except Exception as e:
                    print(f"Error processing {url}: {e}")

def save_raw_data(raw_data, url, output_folder='output'):
    # Generate timestamp
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    os.makedirs(output_folder, exist_ok= True)

    raw_output_path = os.path.join(output_folder, f'rawData_{sanitize_filename(url)}_{timestamp}.html')
    with open(raw_output_path, 'w', encoding='utf-8') as f: 
        f.write(raw_data)
    print(f"Raw data saved to {raw_output_path}")

# Main function to handle command-line arguments
def main():
    if len(sys.argv) > 1:
        file_name = sys.argv[1]
        file_path = os.path.join(output_folder, file_name)
        if os.path.isfile(file_path):
            process_file(file_path)
        else:
            print(f"File '{file_path}' does not exist.")
    else:
        for filename in os.listdir(output_folder):
            if filename.endswith('.json'):
                file_path = os.path.join(output_folder, filename)
                process_file(file_path)

if __name__ == "__main__":
    main()
