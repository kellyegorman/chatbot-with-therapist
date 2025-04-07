import torch
import tensorflow as tf
from transformers import BertTokenizer, TFBertForSequenceClassification
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from tensorflow.keras.optimizers import Adam

# Load the tokenizer and model
MODEL_NAME = "bert-base-uncased"
tokenizer = BertTokenizer.from_pretrained(MODEL_NAME)
model = TFBertForSequenceClassification.from_pretrained(MODEL_NAME, num_labels=2)

# Load dataset
def load_data(file_path):
    df = pd.read_csv(file_path)
    df = df[['text', 'label']]  # Ensure columns are named 'text' and 'label'
    return df

# Tokenize data
def tokenize_data(texts, labels, max_length=128):
    encodings = tokenizer(texts.tolist(), truncation=True, padding=True, max_length=max_length)
    input_ids = np.array(encodings['input_ids'])
    attention_masks = np.array(encodings['attention_mask'])
    labels = np.array(labels)
    return input_ids, attention_masks, labels

# Train the model
def train_model(dataset_path):
    df = load_data(dataset_path)
    
    X_train, X_test, y_train, y_test = train_test_split(df['text'], df['label'], test_size=0.2, random_state=42)

    X_train_ids, X_train_masks, y_train = tokenize_data(X_train, y_train)
    X_test_ids, X_test_masks, y_test = tokenize_data(X_test, y_test)

    train_dataset = tf.data.Dataset.from_tensor_slices(((X_train_ids, X_train_masks), y_train)).batch(16)
    test_dataset = tf.data.Dataset.from_tensor_slices(((X_test_ids, X_test_masks), y_test)).batch(16)

    model.compile(optimizer=Adam(learning_rate=2e-5), loss=model.compute_loss, metrics=["accuracy"])
    model.fit(train_dataset, epochs=2, validation_data=test_dataset)

    model.save_pretrained("./bert_sentiment_model")

# Predict sentiment
def predict(text):
    inputs = tokenizer(text, return_tensors="tf", truncation=True, padding=True, max_length=128)
    outputs = model(inputs['input_ids'], attention_mask=inputs['attention_mask'])
    logits = outputs.logits
    prediction = tf.nn.softmax(logits, axis=1)
    sentiment = "Positive" if np.argmax(prediction) == 1 else "Negative"
    return sentiment

# Example Usage
if __name__ == "__main__":
    dataset_path = "tweets.csv"  # Ensure you have a CSV file with 'text' and 'label' columns
    train_model(dataset_path)
    
    # Test a sample prediction
    sample_text = "I love this product!"
    print(f"Sentiment: {predict(sample_text)}")
