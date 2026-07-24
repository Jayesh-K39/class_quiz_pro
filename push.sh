#!/bin/bash
git add -A
git commit -m "${1:-Worked on the project on $(date)}"
git push origin main
