#!/bin/bash

echo "========================================"
echo "   AI Resume Builder - 一键启动脚本"
echo "========================================"
echo ""

# 检查是否安装了 Node.js
if ! command -v node &> /dev/null
then
    echo "[错误] 未检测到 Node.js，请先前往 https://nodejs.org/ 下载并安装。"
    exit 1
fi

echo "[1/2] 正在检查并安装依赖 (这可能需要几分钟)..."
npm install

echo ""
echo "[2/2] 正在启动本地服务器..."
echo "启动成功后，请在浏览器中访问: http://localhost:3000"
echo ""

# 尝试打开浏览器 (兼容 macOS 和 Linux)
if command -v open &> /dev/null; then
    (sleep 3 && open "http://localhost:3000") &
elif command -v xdg-open &> /dev/null; then
    (sleep 3 && xdg-open "http://localhost:3000") &
fi

# 启动服务
npm run dev
