#!/bin/bash

# REQUIREMENTS
#   - hub: the git wrapper for GitHub
#   - git credentials: https://help.github.com/articles/caching-your-github-password-in-git/


getopt --test > /dev/null
if [[ $? != 4 ]]; then
    echo "I’m sorry, `getopt --test` failed in this environment."
    exit 1
fi

if [ -z "$(which hub)" ] ; then
    echo "I'm sorry, but the `hub` command must be available (wrapper to git for GitHub)"
    exit 2
fi


# options: default:
_logs="log_deploy.txt"          # option: -l
_verbose=0                      # option: -v
_message="updated website"      # option: -m
_msg_file=""                    # option: -f
_branch="master"                # option: -b
_ghuser=$USER


# options: parse command-line
SHORT=m:f:b:l:u:v
LONG=message,file,branch,log,user,verbose
PARSED=`getopt --options $SHORT --longoptions $LONG --name "$0" -- "$@"`
CMD="$0 $@"
if [[ $? != 0 ]]; then
    exit 2
fi
eval set -- "$PARSED"


while true; do
    case "$1" in
        -v|--verbose)
            _verbose=1
            shift
            ;;
        -m|--message)
            _message="$2"
            shift 2
            ;;
        -b|--branch)
            _branch="$2"
            shift 2
            ;;
        -f|--file)
            _msg_file="$2"
            shift 2
            ;;
        -l|--log)
            _logs="$2"
            shift 2
            ;;
        -u|--user)
            _ghuser="$2"
            shift 2
            ;;
        --)
            shift
            break
            ;;
        *)
            echo "Programming error"
            exit 3
            ;;
    esac
done

if [[ $# != 1 ]]; then
    echo "$0: A single input file is required."
    exit 4
fi

_target=$1

#echo "verbose: $v, force: $f, debug: $d, in: $1, out: $outFile"
echo -e "Log for the command: $CMD\n" > $_logs

# run a command and check it succeeded
function run_cmd {
    local _end=""
    if [ $_verbose -ne 0 ] ; then
        echo -n "executing: $@"
        echo "## executing: $@" >> $_logs
        _end="\t[done]\n"
    fi
    eval "$@ 1>>$_logs 2>>$_logs | tee $_logs"
    # "$@" 1>>$_logs 2>>$_logs
    echo -e $_end
    echo "" >> $_logs
    local retc=$?
    if [ $retc -ne 0 ]; then
        echo "ERROR: with $1 (exit code: $retc)" >&2
        exit $retc
    fi
}


# build...
run_cmd "(cd $_target && jekyll build)"

# Copy the lastest version to the root of the website
run_cmd "cp -r $_target/_site/* ."

# commit
if [ -z "$_msg_file" ] ; then
    _git_commit_opts="-a -m '$_message'"
else
    _git_commit_opts="-a -F $_msg_file"
fi

_gh="$_ghuser".github.io


if [ "$_branch" != "master" ] ; then
    # make a new branch and pull request...
    run_cmd "hub checkout -b $_branch"
    run_cmd "hub commit $_git_commit_opts"
    run_cmd "hub push origin $_branch"
    run_cmd "hub pull-request"                # open a text editor for your pull request message
else
    # make a direct commit
    run_cmd "hub checkout -b $_branch"
    run_cmd "hub commit $_git_commit_opts"    # commit the changes (local). This can be undone by "git reset --soft HEAD~1"
    run_cmd "hub push origin $_branch"        # push the changes to the remote repository
fi

