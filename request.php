<?php
$seed = rand(0,4);
//if($seed % 2 == 0) sleep(99);
sleep($seed);
echo '{
      	"errCode": 0,
      	"errMsg": "ok",
      	"data": [{
      		"id": "12345"
      	}, {
      		"value": "shinnlove"
      	}]
      }';
?>