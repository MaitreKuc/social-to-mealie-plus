'use client';
import { useState } from 'react';
import { Spinner } from '@//components/ui/spinner';
import { Input } from '@//components/ui/input';
import { Button } from '@//components/ui/button';
import type { recipeResult } from '../lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState<recipeResult[]>([]);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch('/api/get-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    if (data.name) {
      setRecipes([...recipes, data]);
    }
    setLoading(false);
    if (data.error) {
      alert(data.error);
      return;
    }
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-3xl font-bold'>Welcome to social to Mealie</h1>
      <Input type='url' className='w-96' value={url} onChange={(e) => setUrl(e.target.value)} />
      <Button className='mt-4 w-96' onClick={handleSubmit} disabled={loading}>
        {loading ? 'Loading...' : 'Submit'}
      </Button>
      {loading && <Spinner className='m-4' />}
      <div className='flex flex-wrap justify-center gap-4 max-w-7xl'>
      {recipes.map((recipe) => (
        <a href={recipe.url} key={recipe.url} target='_blank' rel='noreferrer'>
          <Card className='mt-4 w-60'>
            <CardHeader>
              <img src={recipe.imageUrl} alt={recipe.description} className='aspect-square' />
              <CardTitle>{recipe.name}</CardTitle>
              <CardDescription>{recipe.description}</CardDescription>
            </CardHeader>
          </Card>
        </a>
      ))}
      </div>
    </div>
  );
}
