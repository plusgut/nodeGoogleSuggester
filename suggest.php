<?php
	exec( "node /home/plusgut/Projekte/googleComplete/suggest.js " .$_GET[ "key" ], $execOut );
	$output	= print_r( $execOut , true);
	echo nl2br( str_replace("\t", "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;", $output ) );
?>
