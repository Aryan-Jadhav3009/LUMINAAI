import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from datetime import datetime
from bs4 import BeautifulSoup  # For sanitizing HTML

# Load the CSV file
astro_data = pd.read_csv('astrology_data.csv')

# Convert DataFrame to dictionary
astro_dict = astro_data.set_index('sign').T.to_dict()

# Initialize the Gemini API client
genai.configure(api_key='AIzaSyBLV_X5sQ25T7jElvVxZR5eeQ2jMweJMRo')

# Function to retrieve astrology info
def get_astrological_info(sign):
    return astro_dict.get(sign.capitalize(), {"description": "I'm sorry, I don't have information on that sign."})['description']

# Function to calculate zodiac sign
def get_zodiac_sign(date_of_birth):
    date_str = date_of_birth.replace('/', '-').replace(' ', '-')
    date_obj = datetime.strptime(date_of_birth, '%d-%m-%Y')
    month = date_obj.month
    day = date_obj.day

    if (month == 1 and day >= 20) or (month == 2 and day <= 18):
        return "Aquarius"
    elif (month == 2 and day >= 19) or (month == 3 and day <= 20):
        return "Pisces"
    elif (month == 3 and day >= 21) or (month == 4 and day <= 19):
        return "Aries"
    elif (month == 4 and day >= 20) or (month == 5 and day <= 20):
        return "Taurus"
    elif (month == 5 and day >= 21) or (month == 6 and day <= 20):
        return "Gemini"
    elif (month == 6 and day >= 21) or (month == 7 and day <= 22):
        return "Cancer"
    elif (month == 7 and day >= 23) or (month == 8 and day <= 22):
        return "Leo"
    elif (month == 8 and day >= 23) or (month == 9 and day <= 22):
        return "Virgo"
    elif (month == 9 and day >= 23) or (month == 10 and day <= 22):
        return "Libra"
    elif (month == 10 and day >= 23) or (month == 11 and day <= 21):
        return "Scorpio"
    elif (month == 11 and day >= 22) or (month == 12 and day <= 21):
        return "Sagittarius"
    elif (month == 12 and day >= 22) or (month == 1 and day <= 19):
        return "Capricorn"
    else:
        return "Unknown"

# Function to sanitize HTML
def sanitize_html(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Replace unwanted characters or tags
    def sanitize_html(html_content):
        soup = BeautifulSoup(html_content, 'html.parser')
    
    # Replace unwanted characters or tags
        for element in soup.find_all():
            if element.name == 'strong':
                element.replace_with(f"**{element.text}**")
            elif element.name == 'em':
                element.replace_with(f"_{element.text}_")
    
    return str(soup)

# Function to generate AI response
def generate_response(name, date_of_birth, time_of_birth, gender, city, state):
    model = genai.GenerativeModel("gemini-1.5-flash")
    
    # Calculate zodiac sign
    zodiac_sign = get_zodiac_sign(date_of_birth)
    
    # Create a detailed prompt for the AI
    prompt = f"""
    Provide a detailed astrological reading for the following user:
    - Name: {name}
    - Date of Birth: {date_of_birth}
    - Time of Birth: {time_of_birth}
    - Gender: {gender}
    - City: {city}
    - State: {state}
    - Zodiac Sign: {zodiac_sign}

    Act as a personal, trusted astrologer and spiritual guide for 'SoulBuddy - AI-Powered Spiritual Guide.' Your role is to scan the provided user data, process it using your trained knowledge of astrology and numerology, and return precise, actionable insights in an authoritative and empathetic tone. The following describes your specific responsibilities:

Role Definition:
Purpose: Serve as a virtual astrologer and spiritual advisor, offering guidance tailored to the user’s unique profile based on astrological and numerological principles.
Focus: Provide clear, actionable insights derived from the given user data without disclaimers or ambiguity.
Tone: Maintain an authoritative, empathetic, and user-friendly communication style to build trust and ensure clarity.
Primary Responsibilities:
Input Interpretation:

Accurately interpret the provided user details, including:
Name
Date of Birth
Time of Birth
Gender
State and City
Astrological Analysis:

Generate a detailed Birth Chart (Kundali) with insights into:
Career
Relationships
Personal growth
Family and social connections
Compute and present daily and monthly horoscopes based on planetary movements.
Numerological Insights:

Analyze the user’s name and birthdate to deliver numerological readings, including life path numbers, compatibility insights, and personalized advice.
Guidance and Recommendations:

Suggest gemstones aligned with the user’s needs and explain their spiritual benefits.
Recommend rituals (Poojas) with details about their significance and execution.
Provide practical do’s and don’ts tailored to astrological findings.
Spiritual Wellness:


Answering user queries with spiritual insights and astrological reasoning.
Behavior Guidelines:
Do not provide disclaimers; all outputs must be presented as definitive and trustful.
Respond authoritatively and empathetically, ensuring users feel understood and guided.
Focus on delivering results quickly and accurately based on the provided data.

also provide insight into all houses and suggest :
Birth chart (Kundali) covering 12 houses. Insights on career, relationships, personal growth, family, and social connections. Daily and monthly horoscopes.
AI Recommendations:
Personalized gemstone suggestions. Pooja (rituals) recommendations with importance and benefits explained. Do’s and Don’ts based on astrological insights.
Spiritual Content Delivery:
Meditation and workout suggestions aligned with horoscope insights. Sleep content tailored to user needs. provide all 12 houses.

    Format the response using the following guidelines:
    - Use <h3> for section headings.
    - Use <ul> and <li> for lists.
    - Use <p> for paragraphs.
    - Use <strong> for bold text.
    - Avoid using asterisks (`*`) for emphasis or any other purpose.
    - Ensure proper spacing and readability.
    - Do not include disclaimers or notes about preliminary readings unless absolutely necessary.
    """
    
    response = model.generate_content(prompt)
    sanitized_response = sanitize_html(response.text)
    return sanitized_response

# Flask app setup
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


@app.route('/astrology', methods=['POST'])
def astrology_api():
    try:
        required_fields = ['name', 'date_of_birth', 'time_of_birth', 'gender', 'state', 'city']
        for field in required_fields:
            if field not in request.form or not request.form[field]:
                return jsonify({
                    "success": False,
                    "error": f"Missing required field: {field}"
                }), 400
        
        # Access the form data
        name = request.form['name']
        date_of_birth = request.form['date_of_birth']
        time_of_birth = request.form['time_of_birth']
        gender = request.form['gender']
        state = request.form['state']
        city = request.form['city']

        # Generate AI response with all user details
        ai_response = generate_response(name, date_of_birth, time_of_birth, gender, city, state)
        return jsonify({
            "success": True,
            "response": ai_response,  # This is the HTML content
            "zodiac_sign": get_zodiac_sign(date_of_birth)
        })
        # Return HTML response
        return ai_response, 200, {'Content-Type': 'text/html'}
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/compatibility', methods=['POST'])
def compatibility_api():
    try:
        # Access the form data
        your_name = request.form['your_name']
        your_sign = request.form['your_sign']
        partner_name = request.form['partner_name']
        partner_sign = request.form['partner_sign']

        model = genai.GenerativeModel("gemini-1.5-flash")
        
        # Create a detailed prompt for the AI
        prompt = f"""
        Provide a detailed compatibility analysis for:
        - Person 1: {your_name} ({your_sign})
        - Person 2: {partner_name} ({partner_sign})

        Include the following in the analysis:
        1. Overall compatibility score (out of 100%)
        2. Strengths and challenges in the relationship
        3. Communication compatibility
        4. Emotional compatibility
        5. Advice for improving the relationship

        Format the response using HTML tags for better readability:
        - Use <h3> for section headings.
        - Use <p> for paragraphs.
        - Use <ul> and <li> for lists.
        - Use <strong> for bold text.
        - Use <div class="p-4 rounded-lg bg-gradient-to-r from-purple-100/50 to-indigo-100/50 dark:from-purple-900/30 dark:to-indigo-900/30"> for sections.
        - Add some color with <span class="text-purple-600 dark:text-purple-400"> for important terms.
        """
        
        response = model.generate_content(prompt)
        sanitized_response = sanitize_html(response.text)
        
        # Return JSON response
        return jsonify({
            "success": True,
            "response": sanitized_response
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# Add a simple health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
