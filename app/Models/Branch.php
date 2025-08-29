<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Branch extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'images',
        'address',
        'city',
        'district',
        'phone',
        'fax',
        'email',
        'country_id',
        'province_id',
        'geo_lat',
        'geo_lng',
        'map_url',
        'description',
        'is_active',
        'ordering',
        'created_by',
        'updated_by',
        'language',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'geo_lat' => 'float',
        'geo_lng' => 'float',
    ];

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
