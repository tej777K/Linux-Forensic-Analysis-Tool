#!/bin/bash
# File: detect_failed_password.sh
# Authors:
#     - Nandish H R
#     - Ramvikas S V
#     - Hemanth Kumar S
#     - Deepti Bhat

# Define the log file path and position file
AUTH_LOG="/var/log/auth.log"
LOG_POSITION="/tmp/auth_log_position_password"

# Define the threshold for password changes
TIME_DURATION=$2  # in minutes

# Define the threshold for password change attempts
PASSWORD_CHANGE_THRESHOLD=$1

# Function to check password changes
check_password_changes() {
    local output_generated=false  # Flag to check if output is generated
    # Get the last read position from the log file
    if [ -f "$LOG_POSITION" ]; then
        last_position=$(cat "$LOG_POSITION")
    else
        last_position=0
    fi

    # Extract logs since the last position
    new_logs=$(tail -c +$last_position "$AUTH_LOG" | grep "password changed")

    # Filter logs within the specified time duration
    recent_password_changes=$(echo "$new_logs" | awk -v minute="$(date -d "$TIME_DURATION minutes ago" +'%Y-%m-%dT%H:%M:%S')" '$1" "$2 >= minute')

    if [ -z "$recent_password_changes" ]; then
        # Update the log position
        current_position=$(wc -c < "$AUTH_LOG")
        echo "$current_position" > "$LOG_POSITION" 
        return
    fi

    # Count occurrences of each user
    user_counts=$(echo "$recent_password_changes" | awk '{print $NF}' | sort | uniq -c)

    password_changes_detected=false

    while read -r count user; do
        if [ "$count" -ge "$PASSWORD_CHANGE_THRESHOLD" ] && [ -n "$user" ]; then
            user_details=$(echo "$recent_password_changes" | awk -v u="$user" '$NF == u')
            echo "Password changes detected for user '$user' that exceed the threshold of $PASSWORD_CHANGE_THRESHOLD within the past $TIME_DURATION minutes ($count occurrences):"
            echo "$user_details"
            echo "running"
            output_generated=true  # Set flag to true when output is generated         
        fi
    done <<< "$user_counts"
    if $output_generated; then
        # Update the log position
        current_position=$(wc -c < "$AUTH_LOG")
        echo "$current_position" > "$LOG_POSITION"    
    fi
}

# Main loop to continuously monitor
while true; do
    check_password_changes
    sleep 30
done
