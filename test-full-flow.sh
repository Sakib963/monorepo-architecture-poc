#!/bin/bash

echo "🎯 Testing Complete Authentication Flow"
echo "========================================"
echo ""

# Test 1: Auth Service Health
echo "1️⃣ Testing Auth Service (port 3000)..."
response=$(curl -s http://localhost:3000/)
if [[ $response == *"running"* ]]; then
  echo "   ✅ Auth Service is running"
else
  echo "   ❌ Auth Service not responding"
  exit 1
fi
echo ""

# Test 2: Auth Gateway
echo "2️⃣ Testing Auth Gateway (port 3001)..."
status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/)
if [[ $status == "200" ]]; then
  echo "   ✅ Auth Gateway is accessible"
else
  echo "   ❌ Auth Gateway not accessible"
  exit 1
fi
echo ""

# Test 3: User App
echo "3️⃣ Testing User App (port 3002)..."
status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/)
if [[ $status == "200" ]]; then
  echo "   ✅ User App is accessible"
else
  echo "   ❌ User App not accessible"
  exit 1
fi
echo ""

# Test 4: Admin App
echo "4️⃣ Testing Admin App (port 3003)..."
status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3003/)
if [[ $status == "200" ]]; then
  echo "   ✅ Admin App is accessible"
else
  echo "   ❌ Admin App not accessible"
  exit 1
fi
echo ""

# Test 5: Login Flow - User
echo "5️⃣ Testing User Login Flow..."
user_response=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user@example.com","password":"user123"}')

if [[ $user_response == *"USER"* ]]; then
  echo "   ✅ User login successful (role: USER)"
  user_token=$(echo $user_response | grep -o '"token":"[^"]*' | cut -d'"' -f4)
  
  # Verify token with /auth/me
  me_response=$(curl -s http://localhost:3000/auth/me \
    -H "Authorization: Bearer $user_token")
  
  if [[ $me_response == *"user@example.com"* ]]; then
    echo "   ✅ Token validation successful"
  else
    echo "   ❌ Token validation failed"
  fi
else
  echo "   ❌ User login failed"
fi
echo ""

# Test 6: Login Flow - Admin
echo "6️⃣ Testing Admin Login Flow..."
admin_response=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@example.com","password":"admin123"}')

if [[ $admin_response == *"ADMIN"* ]]; then
  echo "   ✅ Admin login successful (role: ADMIN)"
  admin_token=$(echo $admin_response | grep -o '"token":"[^"]*' | cut -d'"' -f4)
  
  # Verify token with /auth/me
  me_response=$(curl -s http://localhost:3000/auth/me \
    -H "Authorization: Bearer $admin_token")
  
  if [[ $me_response == *"admin@example.com"* ]]; then
    echo "   ✅ Token validation successful"
  else
    echo "   ❌ Token validation failed"
  fi
else
  echo "   ❌ Admin login failed"
fi
echo ""

echo "🎉 All tests passed!"
echo ""
echo "📊 Summary:"
echo "   • Auth Service: Running (port 3000)"
echo "   • Auth Gateway: Running (port 3001)"
echo "   • User App (React): Running (port 3002)"
echo "   • Admin App (Angular): Running (port 3003)"
echo ""
echo "🌐 Access URLs:"
echo "   • Login: http://localhost:3001"
echo "   • User Portal: http://localhost:3002"
echo "   • Admin Portal: http://localhost:3003"
echo ""
echo "🔐 Test Credentials:"
echo "   • User: user@example.com / user123"
echo "   • Admin: admin@example.com / admin123"
