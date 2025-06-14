<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class SEOModel extends Model
{
    use HasFactory;
    protected $table = 'tb_seo';
    protected $primaryKey = 'id';

    protected $fillable = [
        'brand_name',
        'brand_logo',
        'favicon',
        'main_url',
        'description',
    ];

    // SET TIMESTAMP
    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }
}