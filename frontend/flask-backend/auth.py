from flask import Flask, request, jsonify
import psycopg2
from psycopg2 import sql
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

# Configure your PostgreSQL connection here
DATABASE_URI = "postgres://chatdb_bj9s_user:9CTH2Tn9rrlSHXQhsRSK5MD5g76FxZPO@dpg-cio7jp95rnuqrn4j1l5g-a.singapore-postgres.render.com/chatdb_bj9s"

def get_db():
    """Get a database connection."""
    conn = psycopg2.connect(DATABASE_URI)
    return conn

def create_tables():
    """Create database tables if they don't exist."""
    conn = get_db()
    cursor = conn.cursor()

    create_users_table = """
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        )
    """

    cursor.execute(create_users_table)
    conn.commit()
    conn.close()

@app.route('/')
def home():
    return "Welcome to the User API"

@app.route('/api/user/register', methods=['POST'])
def register():
    data = request.get_json()

    print(data)

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({'error': 'All fields are required'}), 400

    hashed_password = generate_password_hash(password, method='sha256')

    try:
        conn = get_db()
        cursor = conn.cursor()

        insert_query = sql.SQL("""
            INSERT INTO users (name, email, password)
            VALUES ({}, {}, {})
            RETURNING id
        """).format(sql.Literal(name), sql.Literal(email), sql.Literal(hashed_password))

        cursor.execute(insert_query)
        user_id = cursor.fetchone()[0]
        conn.commit()

        return jsonify({'message': 'Registration successful', 'user_id': user_id}), 201

    except psycopg2.IntegrityError as e:
        conn.rollback()
        return jsonify({'error': 'Email already registered'}), 400
    except Exception as e:
        conn.rollback()
        return jsonify({'error': 'An error occurred'}), 500
    finally:
        conn.close()

@app.route('/api/user/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    conn.close()

    if user and check_password_hash(user[3], password):
        return jsonify({'message': 'Login successful', 'user_id': user[0]}), 200
    else:
        return jsonify({'error': 'Login failed. Please check your email and password'}), 401

if __name__ == '__main__':
    create_tables()  # Create tables before running the app
    app.run(debug=True)
