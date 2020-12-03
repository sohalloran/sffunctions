#!/bin/bash
function="correlation"
target="SteveTarget"
scratchorg="sffunctions_scratch"
#echo "whoami"
#sfdx evergreen:whoami
#echo "my target"
#sfdx evergreen:target:list
#echo "bind"
#sfdx evergreen:org:bind -u $scratchorg -t $target
echo "deploy $function"
cd functions/$function
sfdx evergreen:function:deploy -t $target -u $scratchorg
cd ..

#sfdx evergreen:secret:create my-secret -t SteveTarget --data pass=my-pass
#sfdx evergreen:secret:app:bind --secret=my-secret -t SteveTarget