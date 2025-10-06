#!/usr/bin/env python
"""
Simple API test script for the Budget Tracker
Run this script to test the API endpoints
"""

import requests
import json

BASE_URL = 'http://localhost:8000/api'

def test_api():
    print("🧪 Testing Budget Tracker API")
    print("=" * 50)
    
    # Test 1: Get JWT token
    print("\n1. Testing Authentication...")
    auth_data = {
        'username': 'admin',
        'password': 'admin123'
    }
    
    try:
        response = requests.post(f'{BASE_URL}/auth/token/', json=auth_data)
        if response.status_code == 200:
            tokens = response.json()
            access_token = tokens['access']
            print("✅ Authentication successful")
            print(f"   Access token: {access_token[:20]}...")
        else:
            print(f"❌ Authentication failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to API. Make sure the Django server is running.")
        return
    
    # Set up headers for authenticated requests
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    
    # Test 2: Get categories
    print("\n2. Testing Categories endpoint...")
    try:
        response = requests.get(f'{BASE_URL}/categories/', headers=headers)
        if response.status_code == 200:
            categories = response.json()
            print(f"✅ Categories retrieved: {len(categories)} found")
        else:
            print(f"❌ Categories request failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Categories error: {e}")
    
    # Test 3: Get transactions
    print("\n3. Testing Transactions endpoint...")
    try:
        response = requests.get(f'{BASE_URL}/transactions/', headers=headers)
        if response.status_code == 200:
            transactions = response.json()
            print(f"✅ Transactions retrieved: {len(transactions)} found")
        else:
            print(f"❌ Transactions request failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Transactions error: {e}")
    
    # Test 4: Get summary
    print("\n4. Testing Summary endpoint...")
    try:
        response = requests.get(f'{BASE_URL}/summary/', headers=headers)
        if response.status_code == 200:
            summary = response.json()
            print("✅ Summary retrieved successfully")
            print(f"   Total Income: ${summary.get('total_income', '0.00')}")
            print(f"   Total Expenses: ${summary.get('total_expenses', '0.00')}")
            print(f"   Balance: ${summary.get('balance', '0.00')}")
        else:
            print(f"❌ Summary request failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Summary error: {e}")
    
    # Test 5: Get budgets
    print("\n5. Testing Budgets endpoint...")
    try:
        response = requests.get(f'{BASE_URL}/budgets/', headers=headers)
        if response.status_code == 200:
            budgets = response.json()
            print(f"✅ Budgets retrieved: {len(budgets)} found")
        else:
            print(f"❌ Budgets request failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Budgets error: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 API testing completed!")
    print("\nTo start using the application:")
    print("1. Make sure Django server is running: python manage.py runserver")
    print("2. Make sure React server is running: cd frontend && npm run dev")
    print("3. Open http://localhost:5173 in your browser")
    print("4. Login with username: admin, password: admin123")

if __name__ == '__main__':
    test_api()
