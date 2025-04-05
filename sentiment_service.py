# sentiment_service.py
from flask import Flask, request, jsonify
import pickle
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
import re
from nltk.corpus import stopwords
from nltk.stem import SnowballStemmer
import nltk

# Make sure NLTK stopwords are available
nltk.download('stopwords')

# Global constants (adjust as needed)
SEQUENCE_LENGTH = 300
TEXT_CLEANING_RE = "@\S+|https?:\S+|http?:\S|[^A-Za-z0-9]+"
STOP_WORDS = set(stopwords.words("english"))
STEMMER = SnowballStemmer("english")
SENTIMENT_THRESHOLDS = (0.4, 0.7)
NEGATIVE = "NEGATIVE"
NEUTRAL = "NEUTRAL"
POSITIVE = "POSITIVE"

def preprocess(text, stem=False):
    text = re.sub(TEXT_CLEANING_RE, ' ', str(text).lower()).strip()
    tokens = []
    for token in text.split():
        if token not in STOP_WORDS:
            tokens.append(STEMMER.stem(token) if stem else token)
    return " ".join(tokens)

def decode_sentiment(score, include_neutral=True):
    if include_neutral:
        label = NEUTRAL
        if score <= SENTIMENT_THRESHOLDS[0]:
            label = NEGATIVE
        elif score >= SENTIMENT_THRESHOLDS[1]:
            label = POSITIVE
        return label
    else:
        return NEGATIVE if score < 0.5 else POSITIVE

# Load the trained model and tokenizer once at startup
model = load_model("model.h5")
with open("tokenizer.pkl", "rb") as f:
    tokenizer = pickle.load(f)

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "No text provided."}), 400

    # Preprocess the text
    processed_text = preprocess(text)
    # Convert text to sequence and pad
    x = pad_sequences(tokenizer.texts_to_sequences([processed_text]), maxlen=SEQUENCE_LENGTH)
    # Predict sentiment score
    score = model.predict(x)[0][0]
    # Decode the sentiment label
    sentiment = decode_sentiment(score)
    return jsonify({"sentiment": sentiment, "score": float(score)})

if __name__ == "__main__":
    app.run(port=5001)
