<?php

return [

    /*
    |--------------------------------------------------------------------------
    | AI Marketing API Token
    |--------------------------------------------------------------------------
    |
    | Bearer token used by the AI Marketing service to authenticate requests
    | to POST /api/posts and GET /api/ping.
    |
    */

    'api_token' => env('AI_MARKETING_API_TOKEN'),

    /*
    |--------------------------------------------------------------------------
    | Default Author User ID
    |--------------------------------------------------------------------------
    |
    | Posts created via API will be assigned to this user. Falls back to the
    | first user in the database when not configured.
    |
    */

    'default_user_id' => env('AI_MARKETING_USER_ID'),

];
