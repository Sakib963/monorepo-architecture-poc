#!/bin/bash

# Test Authentication Service
echo "🧪 Testing Auth Service..."
echo ""

# Test 1: Check service health
echo "1️⃣ Testing service health..."
response=$(curl -s http://localhost:3000/)
if [[ $response == *"running"* ]]; then
  echo "✅ Service is running"
  echo "   Response: $response"
else
  echo "❌ Service health check failed"
  exit 1
fi
echo ""

# Test 2: Login as user
echo "2️⃣ Testing user login..."
response=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user@example.com","password":"user123"}')

if [[ $response == *"USER"* ]]; then
  echo "✅ User login successful"
  user_token=$(echo $response | grep -o '"token":"[^"]*' | cut -d'"' -f4)
  echo "   Token: ${user_token:0:30}..."
else
  echo "❌ User login failed"
  echo "   Response: $response"
  exit 1
fi
echo ""

# Test 3: Login as admin
echo "3️⃣ Testing admin login..."
response=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@example.com","password":"admin123"}')

if [[ $response == *"ADMIN"* ]]; then
  echo "✅ Admin login successful"
  admin_token=$(echo $response | grep -o '"token":"[^"]*' | cut -d'"' -f4)
  echo "   Token: ${admin_token:0:30}..."
else
  echo "❌ Admin login failed"
  exit 1
fi
echo ""

# Test 4: Get current user with token
echo "4️⃣ Testing token validation..."
response=$(curl -s http://localhost:3000/auth/me \
  -H "Authorization: Bearer $admin_token")

if [[ $response == *"admin@example.com"* ]]; then
  echo "✅ Token validation successful"
  echo "   User: admin@example.com (ADMIN)"
else
  echo "❌ Token validation failed"
  exit 1
fi
echo ""

# Test 5: Invalid credentials
echo "5️⃣ Testing invalid credentials..."
response=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"invalid@example.com","password":"wrong"}')

if [[ $response == *"Invalid credentials"* ]]; then
  echo "✅ Invalid credentials handled correctly"
else
  echo "❌ Error handling failed"
  exit 1
fi
echo ""

echo "🎉 All tests passed!"
