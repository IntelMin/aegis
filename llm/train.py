import requests
import tqdm
import json
import re
import functools
import pickle


def scrape_solodit():

    # get dataset
    def get_solodit(page):
        headers = {
            'authorization': 'Token 98b30cf101eb0dd220c0024ebda7e9ee906dd5d5', 
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
        }

        params = {
            'source': 'Code4rena',
            'impact': 'HIGH,MEDIUM',
            'finder': '',
            'protocol': '',
            'report_date': '',
            'min_quality_score': '0',
            'min_general_score': '0',
            'tags': '',
            'bookmarked': 'False',
            'keyword': '',
            'page': page,
        }

        response = requests.get('https://solodit.xyz/api/issues/rest/', params=params, headers=headers)
        return response.json()

    # temp_data = get_solodit(1)
    
    # with open("solodit-test.json", "w") as f:
    #     json.dump(temp_data, f)
        
    # exit()
    
    total_pages = get_solodit(1)["total_pages"]

    print(f"[SOLIDIT] Total pages: {total_pages}")

    data = []
    for i in tqdm.tqdm(range(1, total_pages+1)):
        try:
            data += get_solodit(i)["results"]
        except Exception as e:
            print(e)
            print(f"Error in page {i}")
            
    # save all the data
    with open("solodit.json", "w") as f:
        json.dump(data, f)
        
        
# scrape_solodit()
# exit()

def generate_training_data():
    data = []

    with open("solodit.json", "r") as f:
        data = json.load(f)
        



    @functools.lru_cache(maxsize=1000)
    def fetch_github(url):
        response = requests.get(url)
        return response.text

    def crawl(repo, commit_hash, file_name, line_number):
        # line_number = line_number.replace("L", "").replace(">","").replace(")", "").replace(":", "").replace(",", "").replace(".", "").replace("<br>", "").replace("<br", "").replace(";", "").replace("\\", "").replace("#", "")
        # line_number = line_number.split(" ")[0]
        
        first_12_chars = line_number
        
        match = re.search(r'L\d+(?:-L\d+)?', first_12_chars)
        
        line_number = match.group(0)
        line_number = line_number.replace("L", "")
        
        matches = re.findall(r'\d+C', line_number)
        if len(matches) != 0:
            line_number = '-'.join(match[:-1] for match in matches)
        
        # print(f"Fetching {repo} {commit_hash} {file_name} {line_number}")
        
        url = f"https://raw.githubusercontent.com/{repo}/{commit_hash}/{file_name}"
        content = fetch_github(url)
        lines = content.split("\n")
        if "-" in line_number:
            start, end = line_number.split("-")
            start = max(0, int(start))
            end = min(len(lines), int(end) + 1)
        else:
            line_number = int(line_number)
            start = max(0, line_number - 1)
            end = min(len(lines), line_number + 2)

        return "\n".join(lines[start:end])

    training_data = []
    total_lens = 0

    def parse(content):
        loc_and_vuln = content["content"].split("# Vulnerability details")
        loc = loc_and_vuln[0]
        locs = re.findall(r"https://github.com/(.+?)/blob/(.+?)/(.+?)#(.+)", loc)
        vuln = " ".join(content["title"].split("] ")[1:])
        severity = content["impact"]
        
        without_comments  = content["content"]
        comment_start_index = without_comments.find("**[")
        if comment_start_index != -1:
            without_comments = without_comments[:comment_start_index]
            
        without_comments = without_comments.strip() # remove new lines from start and end
        without_comments = re.sub(r'<[^>]+>', '', without_comments) # remove html tags
        
        without_comments = "## Severity: " + severity + "\n\n" + without_comments
        
        without_comments = "# Title: " + vuln + "\n\n" + without_comments
        
        return locs, vuln, without_comments

    # for idx, i in tqdm.tqdm(enumerate(data)):
    
    with tqdm.tqdm(total=len(data), unit='item') as progress_bar:
        for idx, i in enumerate(data):
        
            all_code = ""
            try:
                locs, vuln, without_comments = parse(i)
            except Exception as e:
                print(e)
                print(f"Error in {idx}")
                continue
            

            # if len(vuln) > 950:
            #     print(f"Error in {idx} {len(vuln)}")
            #     continue
            for loc in locs:
                repo, commit_hash, file_name, line_number = loc
                
                                
                try:
                    code = crawl(repo, commit_hash, file_name, line_number)
                    all_code += code + "\n"
                    total_lens += len(vuln)
                except Exception as e:
                    print(f"Error in {idx} {loc}")
                    print(e)
                    
            if len(all_code) > 0:
                

                
                # training_data.append({
                #     "text": all_code,
                #     "label": vuln.strip(),
                # })
                
                training_data.append({
                    "text": all_code,
                    "label": without_comments.strip(),
                })
                
                # print(f"Vuln: {vuln}")
                # print(f"Locs: {locs}")
                # print(f"without_comments: {without_comments}")
                # print(training_data)
                # print(i)
                # exit()
                
            progress_bar.update(1)
                
    removal = []
    for idx, i in enumerate(training_data):
        i["text"] = i["text"].replace("\t", "").replace("    ", "")
        if len(i["text"]) < 20:
            removal.append(idx)
            print(i)

    for i in removal[::-1]:
        del training_data[i]
        
    print(f"Total training data: {len(training_data)}")

    removal = []
    total_lens = []
    for i in training_data:
        if len(i["label"]  + i["text"]) > 1000:
            removal.append(i)
            total_lens.append(len(i["label"] + i["text"]))

    for i in removal[::-1]:
        training_data.remove(i)

    print(f"Total training data (after rem-long): {len(training_data)}")

    with open("training_data.pkl", "wb") as f:
        pickle.dump(training_data, f)
        
# generate_training_data()

# Load existing training data
with open("training_data.pkl", "rb") as f:
    training_data = pickle.load(f)

# Define a system message that describes the role or behavior of your chatbot
system_message = {"role": "system", "content": "Aegis is an AI-powered assistant designed to audit smart contract code. It can identify potential vulnerabilities, suggest improvements, and report its findings with explanations."}

# Write the new format to fine_tune.txt
with open("fine_tune.txt", "w") as fp:
    for i in training_data:

        content = i["label"].strip()
        if (len(content) == 0):
            continue

        # Construct the messages list with the system message, user message (the prompt), and assistant message (the completion)
        messages = [
            system_message,
            {"role": "user", "content": i["text"]},
            {"role": "assistant", "content": i["label"]}
        ]

        # Write out the JSON object for this conversation
        json_object = {"messages": messages}
        fp.write(json.dumps(json_object))
        fp.write("\n")

    fp.close()