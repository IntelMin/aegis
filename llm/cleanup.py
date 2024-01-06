import json
import random
import re

with open("solodit.json", "r") as f:
    data = json.load(f)
    

def process(sample):
    try:
        # print 1 sample
        # sample = data[0]

        # get a random sample
        # random_choice = random.randint(0, len(data))
        # print(f"Random choice: {random_choice}")

        # sample = data[random_choice]

        # sample = data[2046]

        # format the json to be more readable
        readable_json = json.dumps(sample, indent=4, sort_keys=True)

        # save the json to a file
        # with open("sample.json", "w") as f:
        #     f.write(readable_json)
            
        content = sample["content"]

        # print the content
        # print(content)

        # save the content to a file
        # with open("sample_content.txt", "w") as f:
        #     f.write(content)
            
            
        markdown_text = content.replace("### ", "## ")
        markdown_text = markdown_text.replace("^# ", "# ")

        comment_start_index = markdown_text.find("**[")
        if comment_start_index != -1:
            markdown_text = markdown_text[:comment_start_index]


        # Replace lines starting and ending with "_" with "Title"
        lines = markdown_text.split("\n")
        for i, line in enumerate(lines):
            if line.startswith("_") and line.endswith("_"):
                lines[i] = "Title"
        markdown_text = "\n".join(lines)


        loc_and_vuln = sample["content"].split("# Vulnerability details")
        loc = loc_and_vuln[0]
        locs = re.findall(r"https://github.com/(.+?)/blob/(.+?)/(.+?)#(.+)", loc)
        vuln = " ".join(sample["title"].split("] ")[1:])
        severity = sample["impact"]



        # split the content into headings and content
        headings = re.split(r'# ', markdown_text)

        markdown_data = {}

        # for each heading, split the content into heading and content
        for heading in headings:
            
            # loop through the lines
            lines = heading.split("\n")
            actual_heading = ""
            content = ""

            # Check if the first line is the heading
            if lines[0].strip() and not lines[0].startswith("#"):
                actual_heading = lines.pop(0).strip()
                
            # check if author is in lines, format _texthere_
            if lines[0].strip().startswith("_") and lines[0].strip().endswith("_"):
                lines[0] = lines[0].strip().replace("_", "title")

            # Remaining lines are content
            content = "\n".join(lines).strip()
            
            # max 2 \n\n in a row
            content = re.sub(r'\n\n+', '\n\n', content)
            content = content.replace("\\\n", "\n")
            content = content.strip()

            if actual_heading:
                markdown_data[actual_heading] = content

                    
            markdown_data[actual_heading] = content.strip()
            
        # print(markdown_data)
        
        process = False
        
        if "Recommended Mitigation Steps" in markdown_data and len(markdown_data["Recommended Mitigation Steps"].strip()) > 30:
            process = True
            
            if "github.com" in markdown_data["Recommended Mitigation Steps"]:
                process = False
            
        if process:
            if len(locs) == 1:
                process = True
            else:
                process = False


        if process:
            print(f"Locs: {locs}")
            print(f"Vuln: {vuln}")
            print(f"Severity: {severity}")
            print(f"Mitigation: {markdown_data['Recommended Mitigation Steps']}")
            
            clean_sample = {
                "locs": locs,
                "vuln": vuln,
                "severity": severity,
                "mitigation": markdown_data["Recommended Mitigation Steps"]
            }
            
            with open("sample_output.json", "a+") as f:
                f.write(json.dumps(clean_sample) + "\n")

        return process
    except:
        return False
    # json_data = markdown_data

    # # Saving to a JSON file
    # with open('sample_clean.json', 'w') as f:
    #     json.dump(json_data, f, indent=4)
    
random_choice = random.randint(0, len(data))
print(f"Random choice: {random_choice}")

can_process = data[random_choice]

process_count = 0
sanitized_data = []
for sample in data:
    if process(sample):
        process_count += 1
        sanitized_data.append(sample)
        

with open("solidit_clean.json", "w") as f:
    json.dump(sanitized_data, f, indent=4)

print(f"Process count: {process_count}")