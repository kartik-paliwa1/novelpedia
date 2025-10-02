#!/usr/bin/env python3

import sqlite3

def check_database():
    try:
        conn = sqlite3.connect('db.sqlite3')
        cursor = conn.cursor()
        
        # Get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        print("Tables in database:")
        for table in tables:
            print(f"  - {table[0]}")
        
        # Check if tags and genres tables exist
        table_names = [t[0] for t in tables]
        
        if 'tags_tag' in table_names:
            cursor.execute("SELECT COUNT(*) FROM tags_tag")
            tag_count = cursor.fetchone()[0]
            print(f"\nTags in database: {tag_count}")
            
            if tag_count > 0:
                cursor.execute("SELECT id, name FROM tags_tag LIMIT 10")
                tags = cursor.fetchall()
                print("Sample tags:")
                for tag in tags:
                    print(f"  - {tag[0]}: {tag[1]}")
        else:
            print("\nNo tags_tag table found")
            
        if 'genres_genre' in table_names:
            cursor.execute("SELECT COUNT(*) FROM genres_genre")
            genre_count = cursor.fetchone()[0]
            print(f"\nGenres in database: {genre_count}")
            
            if genre_count > 0:
                cursor.execute("SELECT id, name FROM genres_genre LIMIT 10")
                genres = cursor.fetchall()
                print("Sample genres:")
                for genre in genres:
                    print(f"  - {genre[0]}: {genre[1]}")
        else:
            print("\nNo genres_genre table found")
            
        conn.close()
        
    except Exception as e:
        print(f"Error checking database: {e}")

if __name__ == "__main__":
    check_database()