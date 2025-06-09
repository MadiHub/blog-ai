<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class PostTagModel extends Model
{
    use HasFactory;
    protected $table = 'tb_post_tag';
    protected $primaryKey = 'id';

    protected $fillable = [
        'post_id',
        'tag_id',
    ];

    // SET TIMESTAMP
    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }
}