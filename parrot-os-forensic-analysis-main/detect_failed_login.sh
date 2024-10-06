#!/bin/bash
# File: detect_failed_login.sh
# Authors:
#     - Nandish H R
#     - Ramvikas S V
#     - Deepti Bhat

# Define the log file path and position file
AUTH_LOG="/var/log/auth.log"
LOG_POSITION="/tmp/auth_log_position" 

# Time duration in minutes to check for failed logins
TIME_DURATION=$2

# Threshold for failed login attempts
FAILED_LOGIN_THRESHOLD=$1

# Function to get the current machine's IP address
get_current_ip() {
    hostname -I | awk '{print $1}'
}

# Function to get geolocation information for an IP address
get_geoip_info() {
    local ip="$1"
    geoiplookup "$ip" | awk -F ': ' '{print $2}'
}

# Function to check for frequent failed login attempts
check_failed_logins() {
    local output_generated=false  # Flag to check if output is generated
    # Get the last read position from the log file
    if [ -f "$LOG_POSITION" ]; then
        last_position=$(cat "$LOG_POSITION")  # byte position
    else
        last_position=0
    fi
    
    # Extract failed login attempts from the log file since the last position
    new_logs=$(tail -c +$last_position "$AUTH_LOG" | grep "authentication failure")

    # Filter logs within the specified time duration
    recent_failed_logins=$(echo "$new_logs" | awk -v minute="$(date -d "$TIME_DURATION minutes ago" +'%Y-%m-%dT%H:%M:%S')" '$1" "$2 >= minute')

    if [ -z "$recent_failed_logins" ]; then
        # Update the log position
        current_position=$(wc -c < "$AUTH_LOG")
        echo "$current_position" > "$LOG_POSITION"
        return
    fi

    # Count occurrences of each user
    user_counts=$(echo "$recent_failed_logins" | awk '{for (i=1; i<=NF; i++) if ($i ~ /^user=/) print substr($i, 6)}' | sort | uniq -c)

    declare -A seen_pairs  # Associative array to store unique pairs

    while read -r count user; do
        # Check if any user's failed login attempts exceed the threshold
        if [ "$count" -ge "$FAILED_LOGIN_THRESHOLD" ]; then
            start_timestamp=$(echo "$recent_failed_logins" | awk 'NR==1 {print $1" "$2}' | cut -d'.' -f1)
            end_timestamp=$(echo "$recent_failed_logins" | awk 'END {print $1" "$2}' | cut -d'.' -f1)
            echo "User associated with failed logins: $user"
            echo "Start timestamp: $start_timestamp"
            echo "End timestamp: $end_timestamp"
            echo "Failed login attempts: $count occurrences"
            output_generated=true  # Set flag to true when output is generated
            echo "$recent_failed_logins" | while read -r line; do
                ip=$(echo "$line" | awk '{for (i=1; i<=NF; i++) if ($i ~ /^rhost=/) {if (substr($i, 7) == "") print "CURRENT_IP"; else print substr($i, 7)}}')
                if [ "$ip" == "CURRENT_IP" ]; then
                    ip=$(get_current_ip)
                fi
                if [ "$ip" != "$(get_current_ip)" ]; then
                    geoip_info=$(get_geoip_info "$ip")
                else
                    geoip_info="Local Machine"
                fi
                user_in_line=$(echo "$line" | awk -v user="$user" '{for (i=1; i<=NF; i++) if ($i ~ /^user=/ && substr($i, 6) == user) print substr($i, 6)}')
                if [ "$user_in_line" == "$user" ]; then
                    pair="$ip $user"
                    if [[ ! ${seen_pairs["$pair"]+_} ]]; then
                        seen_pairs["$pair"]=1          
                        echo "Failed login from IP address: $ip"
                        echo "Location: $geoip_info"
                    fi
                fi
            done
            echo "--------------------------------------------"
        fi
    done <<< "$user_counts"
    if $output_generated; then
        # Update the log position
        current_position=$(wc -c < "$AUTH_LOG")
        echo "$current_position" > "$LOG_POSITION"    
        echo "End of Report: This report summarizes the analysis of failed login attempts within the specified time frame. Please review the details provided above for security assessments and necessary actions."
    fi
}

# Main loop to continuously monitor the system
while true; do
    check_failed_logins
    sleep 30  # Adjust the sleep interval as needed
done
