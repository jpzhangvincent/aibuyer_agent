import os
import json

def concatenate_listings_from_files(directory):
    all_listings = []

    # Iterate over all files in the specified directory
    for filename in os.listdir(directory):
        if filename.endswith(".json"):
            file_path = os.path.join(directory, filename)
            with open(file_path, 'r') as file:
                data = json.load(file)
                # Check if 'listings' key exists in the JSON data
                if "listings" in data:
                    all_listings.extend(data["listings"])
                else:
                    print(f"No 'listings' key found in {filename}")

    return all_listings

# Specify the directory containing the JSON files
directory = "output"
listings = concatenate_listings_from_files(directory)

# Output the concatenated listings to a new JSON file
output_file_path = os.path.join(directory, "all_listings.json")
with open(output_file_path, 'w') as output_file:
    json.dump({"listings": listings}, output_file, indent=4)

print(f"Concatenated listings saved to {output_file_path}")