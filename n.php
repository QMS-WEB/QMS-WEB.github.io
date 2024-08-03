<?php
// Get the current time
$current_time = date("H:i:s");

// Output the current time in PJL format
echo "@PJL\n";
echo "@ECO TIME = $current_time\n";
echo "@PJL EOJ\n";
?>
