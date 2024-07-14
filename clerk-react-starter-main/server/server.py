from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
import requests
import mysql.connector
import pymysql.cursors
from mysql.connector import Error

app = Flask(__name__)
CORS(app)

# MySQL Configuration
# app.config['MYSQL_HOST'] = 'localhost'
# app.config['MYSQL_USER'] = 'root'
# app.config['MYSQL_PASSWORD'] = 'root'
# app.config['MYSQL_DB'] = 'library'  # Assuming you have a database named books_db
# mysql = MySQL(app)

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'root',
    'database': 'library'
}

def create_db_connection():
    try:
        connection = mysql.connector.connect(**db_config)
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error while connecting to MySQL: {e}")
    return None

@app.route('/api/books/search', methods=['GET'])
def search_books_by_isbn():
    isbn = request.args.get('isbn')
    if not isbn:
        return jsonify({'error': 'ISBN parameter is required'}), 400

    try:
        url = f'https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}'
        response = requests.get(url)
        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            return jsonify({'error': 'Failed to fetch book details'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint to handle book purchase
@app.route('/api/user/purchase', methods=['POST'])
def purchase_book():
    data = request.get_json()
    book = data.get('book')
    connection = create_db_connection()

    if not book:
        return jsonify({'error': 'Book details missing'}), 400
    
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        # Example: Insert purchased book into database
        # Ensure your database schema matches the book data you're sending
        # Replace with your MySQL/MongoDB/etc. database operations
        # Example:
        print(book)
        volume_info = book.get('volumeInfo', {})
        title = volume_info.get('title', '')
        authors = ', '.join(volume_info.get('authors', []))
        published_date = volume_info.get('publishedDate', '')
        industry_identifiers = volume_info.get('industryIdentifiers', [])
        isbn = next((identifier['identifier'] for identifier in industry_identifiers if identifier['type'] == 'ISBN_13'), '')

        # cur = mysql.connection.cursor()
        cur = connection.cursor()
        print(title,authors,published_date,isbn)
        cur.execute("INSERT INTO user_books (isbn,title, authors, published_date) VALUES (%s,%s, %s, %s)",(isbn,title, authors, published_date))
        print("hello")
        connection.commit()
        connection.close()
        print('hello')
        return jsonify({'message': 'Book purchased successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint to fetch user's purchased books
@app.route('/api/user/books', methods=['GET'])
def get_user_books():
    connection = create_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM user_books")
        user_books = cursor.fetchall()
        cursor.close()
        connection.close()

        return jsonify(user_books), 200
    except Exception as e:
        print(f"Error fetching user books: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)