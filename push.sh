#!/bin/bash
git add -A
git commit -m "${1:-Worked on CQP on $(date)}"
git push origin main
