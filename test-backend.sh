#!/bin/bash

echo "Testing backend endpoints..."

# Test root endpoint
echo "Testing GET /"
curl -s http://localhost:8080/ | jq .

echo -e "\nTesting GET /health"
curl -s http://localhost:8080/health | jq .

echo -e "\nTesting GET /search/app"
curl -s http://localhost:8080/search/app | jq .

echo -e "\nTesting GET /insert/test"
curl -s http://localhost:8080/insert/test | jq .

echo -e "\nTesting GET /search/test"
curl -s http://localhost:8080/search/test | jq .

echo -e "\nAll tests completed!"