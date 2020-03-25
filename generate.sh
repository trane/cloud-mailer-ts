#!/usr/bin/env bash

# Path to this plugin
PROTOC_GEN_TS_PATH="./node_modules/.bin/protoc-gen-ts"

# Path to the grpc_node_plugin
PROTOC_GEN_GRPC_PLUGIN_PATH="./node_modules/.bin/grpc_tools_node_protoc_plugin"

# Directory to write generated code to (.js and .d.ts files)
OUT_DIR="./generated"

# Where the proto files all are
PROTO_PATH="${CLOCKTOWER_ROOT}/periscope/cloud-mailer"

# protoc \
# --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
# --plugin="protoc-gen-grpc=${PROTOC_GEN_GRPC_PLUGIN_PATH}" \
# --grpc_out="import_type=commonjs,binary:${OUT_DIR}" \
# --js_out="import_style=commonjs,binary:${OUT_DIR}" \
# --ts_out="service=grpc-node:${OUT_DIR}" \
# --proto_path="${PROTO_PATH}" \
# cloud-mailer.proto

protoc \
--plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
--plugin="protoc-gen-grpc=${PROTOC_GEN_GRPC_PLUGIN_PATH}" \
--grpc_out="${OUT_DIR}" \
--js_out="${OUT_DIR}" \
--ts_out="service=grpc-node:${OUT_DIR}" \
--proto_path="${PROTO_PATH}" \
cloud-mailer.proto