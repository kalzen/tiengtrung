<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = [
        'site_title',
        'logo_path',
        'favicon_path',
        'seo_title',
        'seo_description',
        'seo_keywords',
        'contact_email',
        'contact_phone',
        'contact_address',
        'facebook_url',
        'youtube_url',
        'tiktok_url',
        'zalo_url',
    ];

    protected $casts = [
        'seo_keywords' => 'array',
    ];

    public static function getSettings()
    {
        $settings = static::first();
        if (!$settings) {
            // Tạo settings mặc định nếu chưa có
            $settings = static::create([
                'site_title' => 'Trung tâm dạy và học Tiếng Trung Toàn Diện',
                'seo_title' => 'Trung tâm dạy và học Tiếng Trung Toàn Diện',
                'seo_description' => 'Là một địa chỉ dạy tiếng trung uy tín tại Hải Phòng, nơi chia sẻ MIỄN PHÍ tất cả những kiến thức về Tiếng Trung một cách bài bản và chuyên sâu nhất.',
                'seo_keywords' => ['học tiếng trung', 'dạy tiếng trung'],
                'contact_address' => 'số 515 Lô 22 Lê Hồng Phong, Đông Khê, Ngô Quyền, Hải Phòng',
                'contact_phone' => '097.333.0143 / 09814.89998',
                'contact_email' => 'tiengtrungtoandien@gmail.com',
                'facebook_url' => 'https://www.facebook.com/tiengtrungtoandien/',
                'youtube_url' => 'https://www.youtube.com/channel/UCzmJoh6-LehB51HGOXG_aVA',
            ]);
        }
        return $settings;
    }

    // Accessor methods để tương thích với interface mới
    public function getTitleAttribute()
    {
        return $this->site_title;
    }

    public function getCompanyNameAttribute()
    {
        return 'Tiếng Trung Toàn Diện';
    }

    public function getDescriptionAttribute()
    {
        return $this->seo_description;
    }

    public function getKeywordsAttribute()
    {
        return $this->seo_keywords;
    }

    public function getAddressAttribute()
    {
        return $this->contact_address;
    }

    public function getPhoneAttribute()
    {
        return $this->contact_phone;
    }

    public function getEmailAttribute()
    {
        return $this->contact_email;
    }

    public function getFacebookAttribute()
    {
        return $this->facebook_url;
    }

    public function getYoutubeChannelAttribute()
    {
        return $this->youtube_url;
    }

    public function getWorkingHoursAttribute()
    {
        return 'Thứ 2 - Chủ nhật: 8:00 - 21:00';
    }

    public function getImageAttribute()
    {
        return $this->logo_path;
    }

    public function getFaviconAttribute()
    {
        return $this->favicon_path;
    }
}
