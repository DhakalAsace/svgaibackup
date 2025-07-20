#!/bin/bash

# Test script for anonymous generation limits
# This script tests the implementation without needing Jest setup

API_URL="${API_URL:-http://localhost:3000}"
TEST_IP="192.168.100.50"

echo "🧪 Testing Anonymous Generation Limits"
echo "=====================================\n"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test SVG Generation Limits
echo "📊 Testing SVG Generation (Limit: 1)"
echo "-----------------------------------"

echo "Test 1: First SVG generation (should succeed)"
RESPONSE1=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/generate-svg" \
  -H "Content-Type: application/json" \
  -H "x-forwarded-for: $TEST_IP" \
  -d '{
    "prompt": "Test SVG generation 1",
    "style": "any",
    "size": "1024x1024",
    "aspect_ratio": "Not set"
  }')

HTTP_CODE1=$(echo "$RESPONSE1" | tail -n 1)
BODY1=$(echo "$RESPONSE1" | sed '$d')

if [ "$HTTP_CODE1" = "200" ]; then
  echo -e "${GREEN}✓ First SVG generation succeeded (HTTP $HTTP_CODE1)${NC}"
else
  echo -e "${RED}✗ First SVG generation failed (HTTP $HTTP_CODE1)${NC}"
  echo "Response: $BODY1"
fi

echo "\nTest 2: Second SVG generation (should fail with 429)"
RESPONSE2=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/generate-svg" \
  -H "Content-Type: application/json" \
  -H "x-forwarded-for: $TEST_IP" \
  -d '{
    "prompt": "Test SVG generation 2",
    "style": "any",
    "size": "1024x1024",
    "aspect_ratio": "Not set"
  }')

HTTP_CODE2=$(echo "$RESPONSE2" | tail -n 1)
BODY2=$(echo "$RESPONSE2" | sed '$d')

if [ "$HTTP_CODE2" = "429" ]; then
  echo -e "${GREEN}✓ Second SVG generation correctly blocked (HTTP $HTTP_CODE2)${NC}"
  if echo "$BODY2" | grep -q "Sign up to continue generating for free"; then
    echo -e "${GREEN}✓ Correct error message returned${NC}"
  else
    echo -e "${YELLOW}⚠ Unexpected error message: $BODY2${NC}"
  fi
else
  echo -e "${RED}✗ Second SVG generation not blocked (HTTP $HTTP_CODE2)${NC}"
  echo "Response: $BODY2"
fi

# Test Icon Generation Limits
echo "\n\n🎨 Testing Icon Generation (Limit: 2)"
echo "------------------------------------"

# Use different IP for icon tests
ICON_TEST_IP="10.0.0.100"

echo "Test 3: First icon generation (should succeed)"
RESPONSE3=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/generate-icon" \
  -H "Content-Type: application/json" \
  -H "x-forwarded-for: $ICON_TEST_IP" \
  -d '{
    "prompt": "Test icon generation 1",
    "style": "icon",
    "size": "1024x1024",
    "aspect_ratio": "1:1"
  }')

HTTP_CODE3=$(echo "$RESPONSE3" | tail -n 1)
if [ "$HTTP_CODE3" = "200" ]; then
  echo -e "${GREEN}✓ First icon generation succeeded (HTTP $HTTP_CODE3)${NC}"
else
  echo -e "${RED}✗ First icon generation failed (HTTP $HTTP_CODE3)${NC}"
fi

echo "\nTest 4: Second icon generation (should succeed)"
RESPONSE4=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/generate-icon" \
  -H "Content-Type: application/json" \
  -H "x-forwarded-for: $ICON_TEST_IP" \
  -d '{
    "prompt": "Test icon generation 2",
    "style": "icon",
    "size": "1024x1024",
    "aspect_ratio": "1:1"
  }')

HTTP_CODE4=$(echo "$RESPONSE4" | tail -n 1)
if [ "$HTTP_CODE4" = "200" ]; then
  echo -e "${GREEN}✓ Second icon generation succeeded (HTTP $HTTP_CODE4)${NC}"
else
  echo -e "${RED}✗ Second icon generation failed (HTTP $HTTP_CODE4)${NC}"
fi

echo "\nTest 5: Third icon generation (should fail with 429)"
RESPONSE5=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/generate-icon" \
  -H "Content-Type: application/json" \
  -H "x-forwarded-for: $ICON_TEST_IP" \
  -d '{
    "prompt": "Test icon generation 3",
    "style": "icon",
    "size": "1024x1024",
    "aspect_ratio": "1:1"
  }')

HTTP_CODE5=$(echo "$RESPONSE5" | tail -n 1)
BODY5=$(echo "$RESPONSE5" | sed '$d')

if [ "$HTTP_CODE5" = "429" ]; then
  echo -e "${GREEN}✓ Third icon generation correctly blocked (HTTP $HTTP_CODE5)${NC}"
  if echo "$BODY5" | grep -q "Sign up to continue generating for free"; then
    echo -e "${GREEN}✓ Correct error message returned${NC}"
  fi
else
  echo -e "${RED}✗ Third icon generation not blocked (HTTP $HTTP_CODE5)${NC}"
fi

# Test separate tracking
echo "\n\n🔄 Testing Separate Tracking for SVG and Icons"
echo "----------------------------------------------"

COMBINED_TEST_IP="172.16.0.50"

echo "Test 6: Generate 1 SVG with new IP"
curl -s -o /dev/null -w "HTTP %{http_code}\n" -X POST "$API_URL/api/generate-svg" \
  -H "Content-Type: application/json" \
  -H "x-forwarded-for: $COMBINED_TEST_IP" \
  -d '{
    "prompt": "Combined test SVG",
    "style": "any",
    "size": "1024x1024",
    "aspect_ratio": "Not set"
  }'

echo "Test 7: Should still be able to generate 2 icons with same IP"
for i in 1 2; do
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/api/generate-icon" \
    -H "Content-Type: application/json" \
    -H "x-forwarded-for: $COMBINED_TEST_IP" \
    -d "{
      \"prompt\": \"Combined test icon $i\",
      \"style\": \"icon\",
      \"size\": \"1024x1024\",
      \"aspect_ratio\": \"1:1\"
    }")
  
  if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Icon $i generation succeeded (separate from SVG limit)${NC}"
  else
    echo -e "${RED}✗ Icon $i generation failed (HTTP $HTTP_CODE)${NC}"
  fi
done

echo "\n\n📊 Test Summary"
echo "==============="
echo "SVG limit: 1 generation per IP per day"
echo "Icon limit: 2 generations per IP per day"
echo "Limits are tracked separately by generation type"
echo "IPs are hashed before storage for privacy"
echo "\n✅ All tests completed!"