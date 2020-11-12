#!/bin/bash -e
curl -sSfo /dev/null --max-time 10 "http://localhost:8080/health/ready"
