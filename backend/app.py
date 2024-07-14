from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'library_db'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

mysql = MySQL(app)

@app.route('/api/books', methods=['GET'])
def get_books():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM books")
    books = cursor.fetchall()
    cursor.close()
    return jsonify(books)

@app.route('/api/books/<int:id>', methods=['GET'])
def get_book(id):
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM books WHERE id = %s", (id,))
    book = cursor.fetchone()
    cursor.close()
    return jsonify(book)

@app.route('/api/books', methods=['POST'])
def add_book():
    data = request.get_json()
    cursor = mysql.connection.cursor()
    
    # First, check if the book with the given ISBN already exists
    cursor.execute("SELECT * FROM books WHERE ISBN = %s", (data['ISBN'],))
    existing_book = cursor.fetchone()
    
    if existing_book:
        # If the book exists, update the quantity
        new_quantity = existing_book['quantity'] + data['quantity']
        cursor.execute(
            "UPDATE books SET quantity = %s WHERE ISBN = %s",
            (new_quantity, data['ISBN'])
        )
        message = 'Book quantity updated successfully'
    else:
        # If the book doesn't exist, add it as a new book
        cursor.execute(
            "INSERT INTO books (ISBN, title, author, publisher, year, genre, quantity, availability_status) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
            (data['ISBN'], data['title'], data['author'], data['publisher'], data['year'], data['genre'], data['quantity'], data['availability_status'])
        )
        message = 'Book added successfully'
    
    mysql.connection.commit()
    cursor.close()
    return jsonify({'message': message}), 201

@app.route('/api/books/<isbn>', methods=['DELETE'])
def delete_book(isbn):
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("DELETE FROM books WHERE ISBN = %s", (isbn,))
        mysql.connection.commit()
        cursor.close()
        return jsonify({'message': f'Book with ISBN {isbn} deleted'}), 200
    except Exception as e:
        print(f"Error deleting book: {e}")
        return jsonify({'message': 'Failed to delete book'}), 500

@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT COUNT(*) AS totalBooks FROM books")
        total_books = cursor.fetchone()
        cursor.close()

        statistics = {
            'totalBooks': total_books['totalBooks'],
            'activeUsers': 50,  # Static value for demonstration
            # Add more statistics as needed
        }

        return jsonify(statistics), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)