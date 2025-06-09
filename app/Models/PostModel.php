<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class PostModel extends Model
{
    use HasFactory;
    protected $table = 'tb_post';
    protected $primaryKey = 'id';

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'slug',
        'content',
        'status',
        'thumbnail',
        'published_at',
    ];

    // SET TIMESTAMP
    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function category()
    {
        return $this->belongsTo(CategoryModel::class, 'category_id', 'id');
    }

    public function images()
    {
        return $this->hasMany(PostImageModel::class, 'post_id');
    }

    public function tags()
    {
        return $this->belongsToMany(TagModel::class, 'tb_post_tag', 'post_id', 'tag_id');
    }

    
}