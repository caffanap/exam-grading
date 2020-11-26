<?php

$router->group(['prefix' => 'api/v1/user/', 'middleware' => ['auth']], function () use ($router) {
	$router->post('/assign-nilai-tryout', 'NilaiTryoutController@assignTryout');
});