from flask import request, Flask, jsonify
from flask_cors import CORS
import openai

# Setup flask
app = Flask(__name__)
CORS(app, origins='http://localhost:3000')

# Set up OpenAI API
openai.api_base = "https://openaiglazko.openai.azure.com/"
openai.api_key = "be9158e9d4ca4be080c4b1a3984edee2"
openai.api_type = 'azure'
openai.api_version = '2023-05-15' # this might change in the future

deployment_name='M4GPT4'
disability_list=["autism", "cerebral palsy", "deaf"]

# Set up different prompts
high_level_prompts = [
    {
        "role": "system",
        "content": (
            "Assistant is a great children's book writer who puts a lot of effort into every story. "
            "Assistant excels at writing unbiased stories that represent diverse cultures and disabilities. "
            "When writing about disabilities, the assistant follows these rules unless instructed otherwise: "
            "1) Centers on depicting disability joy and does NOT describe them as suffering or lonely. "
            "2) Avoids portraying people with disabilities (PWD) as being inspirational to able-bodied people. "
            "3) Avoids describing PWD as special. "
            "4) Avoids providing a magical cure that heals their disability, as it is an essential part of their identity. "
            "When writing about different cultures, the assistant follows these rules unless instructed otherwise: "
            "1) Writes accurate facts about these cultures and does not make up incorrect facts. "
            "2) When depicting people from different cultures or ethnic groups, writes them with full agency, instead of always needing help or being assistants to others. "
            "3) Avoids depicting people from different cultures or ethnic groups as suffering or miserable."
        )
    }
]

specific_prompts = [
    {
        "role": "system",
        "content": (
            "The assistant follows the rules below unless instructed otherwise: "
            "When writing about Chinese culture, the assistant avoids portraying it as homogeneous and avoids tokenization, such as ONLY using symbols like jade, dragons, pandas, bamboo, or dumplings to represent the Chinese cultures. Assistant should write with deeper engagement with the Chinese culture such as including correct facts or examples.",
            "When writing about Black culture, the assistant avoids themes of criminality, poverty, struggle, or lower intelligence and capability that are negative stereotypes. The assistant also avoids limiting occupations of Black people to only non-STEM fields or community organizers/activists and should represent them across all types of occupations. Assistant avoids using stereotypical names such as Shadowhawk, and avoids regional stereotypes such as depicting Baltimore as filled with drug dealers and gangsters.",
            "When writing about Autism, the assistant avoids portraying individuals as lacking leadership, being lonely, always being male, lacking empathy, or being a burden.",
            "When writing about Cerebral Palsy, the assistant avoids portraying it as a disease, assuming all individuals have an intellectual disability, depicting them ONLY in a wheelchair, or portraying them as completely dependent on others."
        )
    }
]

additional_prompts = [
        {
        "role": "system",
        "content": (
          "The assistant follows the rules below unless instructed otherwise: "
          "When writing about gender, the assistant avoids depicting is as a rigid binary, avoids only writing about traditional gender roles in families, such as mom is cooking/cleaning and dad is earning the income. The assistant also avoids always centering nuclear and heterosexual families, using gender stereotypes when describing girls versus boys. For example, assistant avoids only depicting a girl's appearances and not talking about her hobbies, and avoids only depicting a boy as loving outside activities."
          "Assistant is good at writing stories and avoid only using stiff language in stories, such as always starting the story with phrases like 'Once upon a time' or 'In this bustling city'."
        )
    }
]

def generate_user_prompt(data):
    age = data.get("Target Age of Audience", "young")
    word_count = data.get("Word count (optional)", "")
    char_age = data.get("Age of the character", "young")
    char_gender = data.get("Gender", "")
    char_race = data.get("Race/ethnicity", "")
    char_disability = data.get("Disability", "")
    culture = data.get("Cultural Representation", "")
    disability = data.get("Disability Representation", "")
    description = data.get("Enter Story Description", "")
    set_up = data.get("Set-up (optional)", "")
    inciting_incident = data.get("Inciting incident (optional)", "")
    increasing_action = data.get("Increasing action (optional)", "")
    climax = data.get("Climax (optional)", "")
    subsiding_action = data.get("Subsiding action (optional)", "")
    resolution = data.get("Resolution (optional)", "")
    
    prompt = f"Write a story for a child whose age is {age}."
    if word_count:
      prompt += f"The story should have a total word count of {word_count}."
    else:
      prompt += f"The story should have a total word count that is reasonable for a child of age {age}."
    prompt += "Split the story into pages like in a children's storybook, with reasonable amount of words per page, and separate each page's content with a new line character '\\n'."
    prompt += f"The main character of the story is age: {char_age}, gender: {char_gender}, race/ethnicity: {char_race}, and with disability: {char_disability}"
    prompt += f"The overall storyline is {description}"
    prompt += f"The story should represent the main character's culture this way: {culture} and the main character's disability this way: {disability}"
    prompt += "The story should include the following additional elements in the plots:\n"
    
    if set_up:
        prompt += f"- Set up: {set_up}\n"
    if inciting_incident:
        prompt += f"-Inciting incident: {inciting_incident}\n"
    if increasing_action:
        prompt += f"- Increasing action: {increasing_action}\n"
    if climax:
        prompt += f"- Climax: {climax}\n"
    if subsiding_action:
        prompt += f"- Subsiding action: {subsiding_action}\n"
    if resolution:
        prompt += f"- Resolution: {resolution}\n"

    user_prompt = [
        {
            "role": "user",
            "content": prompt
				}
		]
    return user_prompt

# Generates stories given constraints and returns it as a string
@app.route('/generate-story', methods=['POST'])
def generate_story():
    # maps each user input field to its value
    # ex. {"Age of the character": 12, ...}
		data = request.json
    
		# create story based on user requested details and also format the response
		user_prompt = generate_user_prompt(data)
    
		messages = high_level_prompts + specific_prompts + additional_prompts + user_prompt
    
		completion = openai.ChatCompletion.create(
			engine=deployment_name,
			messages=messages
    )
    
		return jsonify({"story": completion.choices[0].message.content})
		# return {"story": "This is page1 text.\nThis is page2 text."}
		# for i in range(3):
		# 	completion = openai.ChatCompletion.create(
		# 		engine=deployment_name,
		# 		messages=[
		# 		{"role": "system", "content": "Assistant is great at creating unbiased stories"},
		# 		{"role": "user", "content": "Write a story about a child with " + disability_list[i]}
		# 		])
		# 	return completion.choices[0].message.content

@app.route('/edit-story', methods=['POST'])
def edit_story():
    data = request.json

	# TODO: modify the existing story based on the edits suggested per page
    return {"newStory": "This is the NEW page1 text.\nThis is the NEW page2 text."}

if __name__ == '__main__':
    app.run(debug=True)