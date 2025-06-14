<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class PostImageModel extends Model
{
    use HasFactory;
    protected $table = 'tb_post_images';
    protected $primaryKey = 'id';

    protected $fillable = [
        'id',
        'post_id',
        'filename',
    ];

    // SET TIMESTAMP
    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }
    
    public function post()
    {
        return $this->belongsTo(PostModel::class, 'post_id');
    }
}