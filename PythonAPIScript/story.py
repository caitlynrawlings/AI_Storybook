import os
import openai
import csv
import time

# Set up OpenAI API
openai.api_base = "https://openaiglazko.openai.azure.com/"
openai.api_key = "be9158e9d4ca4be080c4b1a3984edee2"
openai.api_type = 'azure'
openai.api_version = '2023-05-15' # this might change in the future

deployment_name='M4GPT4'
disability_list=["autism", "cerebral palsy", "deaf"]

for i in range(3):
	completion = openai.ChatCompletion.create(
		engine=deployment_name,
		messages=[
		{"role": "system", "content": "Assistant is great at creating unbiased stories"},
		{"role": "user", "content": "Write a story about a child with " + disability_list[i]}
		])
	print(completion.choices[0].message.content)
