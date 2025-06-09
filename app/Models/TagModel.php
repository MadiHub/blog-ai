<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class TagModel extends Model
{
    use HasFactory;
    protected $table = 'tb_tags';
    protected $primaryKey = 'id';

    protected $fillable = [
        'name',
        'slug',
    ];

    // SET TIMESTAMP
    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }
}