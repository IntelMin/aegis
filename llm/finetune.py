import openai
from openai import OpenAI
import time

OPENAI_API_KEY = "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"

# OpenAI API Key
openai.api_key = OPENAI_API_KEY

OPENAI_TRAIN_FILE_NAME = f'ad1'

# Upload Training file to OpenAI
# ft_train_file = openai.File.create(file = open('finetune.jsonl', 'rb'), 
#                                    purpose = 'fine-tune', 
#                                    user_provided_filename = OPENAI_TRAIN_FILE_NAME)


# Summary
# print("FineTune Train File:")
# print(ft_train_file)

# openai_files = openai.File.list()

# print("OpenAI Files:")
# print(openai_files)

ft_train_file_id = "file-yIKmxcQo12swaRQjTbOQRfVK"

# Create finetuned model
# fine_tune_job = openai.FineTuningJob.create(training_file = ft_train_file['id'],
#                                             validation_file = ft_validation_file['id'],
#                                             model = "gpt-3.5-turbo",
#                                             hyperparameters = {"n_epochs": 1})

# Create finetuned model
client = OpenAI(api_key=OPENAI_API_KEY)

# client.fine_tuning.jobs.create(
#   training_file=ft_train_file_id, 
#   model="gpt-3.5-turbo"
# )

# List 10 fine-tuning jobs
ft_jobs = client.fine_tuning.jobs.list(limit=10)

print(ft_jobs)

current_job = "ftjob-50UyZ0zwwuVEsCCdJIDytJgN"

check = True
while (check):

    status = client.fine_tuning.jobs.retrieve(current_job)
    # FineTuningJob(id='ftjob-50UyZ0zwwuVEsCCdJIDytJgN', created_at=1699369421, error=None, fine_tuned_model=None, finished_at=None, hyperparameters=Hyperparameters(n_epochs='auto', batch_size='auto', learning_rate_multiplier='auto'), model='gpt-3.5-turbo-1106', object='fine_tuning.job', organization_id='org-JX3Vo1ManbkOrnfbG7eLOFL3', result_files=[], status='validating_files', trained_tokens=None, training_file='file-yIKmxcQo12swaRQjTbOQRfVK', validation_file=None)
    
    print(f"Status: {status.status}")
    print(f"Error: {status.error}")
    
    if "result_files" in status and len(status.result_files) > 0:
        check = False
    
    time.sleep(5)


exit()
fine_tune_job = openai.FineTuningJob.create(training_file = ft_train_file_id,
                                            model = "gpt-3.5-turbo-1006",
                                            hyperparameters = {"n_epochs": 1})

# Summary
print("FineTune Job:")
print(fine_tune_job)

# Get FineTuningJob Id
ft_job_id = fine_tune_job['id']
print(f'\nFineTuneJob ID: {ft_job_id}')


check = True
while(check):

    # Retrieve the state of a fine-tune
    ft_job = openai.FineTuningJob.retrieve(ft_job_id)

    # Summary
    print(ft_job)

    # List up to 5 events from a fine-tuning job
    openai.FineTuningJob.list_events(id = ft_job_id, limit = 5)

    if "result_files" in ft_job and len(ft_job['result_files']) > 0:
        check = False
        
    

# Get Results File ID from FinetuningJob
ft_file_results_id = ft_job['result_files']
print(f'Metrics Result File ID: {ft_file_results_id}')

# Get FineTuned Model Identifier
ft_model_id = ft_job['fine_tuned_model']
print(f'FineTuned Model Identifier: {ft_model_id}')

# Get Metric Results File
finetune_metrics = openai.File.download(ft_file_results_id[0])

# Show Finetune Metrics
print("Finetune Metrics:")
print(finetune_metrics)

