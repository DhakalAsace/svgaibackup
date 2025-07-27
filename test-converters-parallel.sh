#!/bin/bash

# Parallel Converter Testing Script
# This script launches 8 parallel test processes to test all 40 converters simultaneously

echo "Starting parallel converter tests..."

# Create results directory
mkdir -p test-results/parallel-tests

# Function to test a group of converters
test_converter_group() {
    local group_name=$1
    local converters=$2
    local output_file="test-results/parallel-tests/${group_name}-results.json"
    
    echo "Testing ${group_name} converters..." > "$output_file"
    
    # Use curl to test each converter
    for converter in $converters; do
        echo "Testing $converter..."
        curl -s "http://localhost:3000/convert/$converter" -o /dev/null -w "%{http_code} %{time_total}s\n" >> "$output_file"
    done
}

# Launch all test groups in parallel
test_converter_group "popular" "png-to-svg svg-to-png jpg-to-svg svg-to-pdf webp-to-svg" &
test_converter_group "image-to-svg" "bmp-to-svg gif-to-svg tiff-to-svg ico-to-svg heic-to-svg" &
test_converter_group "svg-to-image" "svg-to-jpg svg-to-webp svg-to-bmp svg-to-gif svg-to-tiff" &
test_converter_group "vector-formats" "svg-to-eps eps-to-svg svg-to-ai ai-to-svg svg-to-dxf" &
test_converter_group "document" "pdf-to-svg svg-to-html svg-to-canvas dxf-to-svg svg-to-wmf" &
test_converter_group "specialized" "svg-to-base64 base64-to-svg svg-to-react svg-to-vue svg-to-css" &
test_converter_group "mobile" "svg-to-android svg-to-xaml svg-to-swiftui text-to-svg svg-to-font" &
test_converter_group "data" "csv-to-svg json-to-svg svg-to-emf svg-to-ico svg-converter" &

# Wait for all parallel processes to complete
wait

echo "All parallel tests completed! Check test-results/parallel-tests/ for results."