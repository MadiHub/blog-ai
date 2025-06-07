<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class CategoryModel extends Model
{
    use HasFactory;
    protected $table = 'tb_categories';
    protected $primaryKey = 'id';

    protected $fillable = [
        'name',
        'slug',
        'image',
    ];

    // SET TIMESTAMP
    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }
}