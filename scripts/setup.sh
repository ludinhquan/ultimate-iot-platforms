#!/bin/bash

echo "Build helm charts started"

helm dep up infra/k8s/services
helm dep up infra/k8s/deps

echo "Build helm charts completed"
