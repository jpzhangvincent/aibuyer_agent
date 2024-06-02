from firecrawl import FirecrawlApp
from openai import OpenAI
from dotenv import load_dotenv
from bs4 import BeautifulSoup
import os
import json
import pandas as pd 
from datetime import datetime 
import subprocess

def scrape_data(url):
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

def filter_html_content(html):
    soup = BeautifulSoup(html, 'html.parser')

    # Find the specific container
    container = soup.find('div', id='grid-search-results')

    if container is None:
        raise Exception("Couldn't find the container with id 'grid-search-results'")

    # Extract text and preserve links within the container
    for a in container.find_all('a'):
        if 'href' in a.attrs:
            a.insert_after(f" ({a['href']})")
    
    # Remove script and style elements within the container
    for script_or_style in container(['script', 'style']):
        script_or_style.decompose()

    # Extract image links from <img> and <picture> tags within the container
    for picture in container.find_all('picture'):
        img_tag = picture.find('img')
        if img_tag and 'src' in img_tag.attrs:
            img_link = img_tag['src']
            picture.insert_after(f"\n[Image: {img_link}]\n")

    # Extract text while preserving newlines within the container
    text = container.get_text(separator='\n', strip=True)

    return text


def save_raw_data(raw_data, timestamp, output_folder='output'):
    os.makedirs(output_folder, exist_ok= True)

    raw_output_path = os.path.join(output_folder, f'rawData_{timestamp}.md')
    with open(raw_output_path, 'w', encoding='utf-8') as f: 
        f.write(raw_data)
    print(f"Raw data saved to {raw_output_path}")

def format_data(data, fields=None):
    load_dotenv()
    # Instantiate the OpenAI client
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

    # Assign default fields if not provided
    if fields is None:
        fields = ["Address", "Real Estate Agency", "Price", "Beds", "Baths", "Sqft", "Home Type", "Listing Age", "Picture of home URLs", "Listing URL"]

    # Define system message content
    system_message = f"""You are an intelligent text extraction and conversion assistant. Your task is to extract structured information 
                        from the given text and convert it into a pure JSON format. The JSON should contain only the structured data extracted from the text, 
                        with no additional commentary, explanations, or extraneous information. 
                        You could encounter cases where you can't find the data of the fields you have to extract or the data will be in a foreign language.
                        Please process the following text and provide the output in pure JSON format with no words before or after the JSON:"""

    # Define user message content
    user_message = f"Extract the following information from the provided text:\nPage content:\n\n{data}\n\nInformation to extract: {fields}"


    response = client.chat.completions.create(
        model="gpt-4o",
        response_format={ "type": "json_object" },
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
        print(f"Formatted data received from API: {formatted_data}")

        try:
            parsed_json = json.loads(formatted_data)
        except json.JSONDecodeError as e:
            print(f"JSON decoding error: {e}")
            print(f"Formatted data that caused the error: {formatted_data}")
            raise ValueError("The formatted data could not be decoded into JSON.")
        
        return parsed_json
    else:
        raise ValueError("The OpenAI API response did not contain the expected choices data.")
    

def save_formatted_data(formatted_data, timestamp, output_folder='output'):
    # Ensure the output folder exists
    os.makedirs(output_folder, exist_ok=True)
    
    # Save the formatted data as JSON with timestamp in filename
    output_path = os.path.join(output_folder, f'sorted_data_{timestamp}.json')

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(formatted_data, f, indent=4)
    print(f"Formatted data saved to {output_path}")


if __name__ == "__main__":
    # Scrape a single URL
    url = 'https://www.zillow.com/oakland-ca/'

    try:
        # Generate timestamp
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        # Scrape data
        raw_data = scrape_data(url)

        filtered_raw_data = filter_html_content(raw_data)
        
        # Save raw data
        save_raw_data(filtered_raw_data, timestamp)


        # Format data
        formatted_data = format_data(filtered_raw_data)
        
        # Save formatted data
        save_formatted_data(formatted_data, timestamp)
    except Exception as e:
        print(f"An error occurred: {e}")