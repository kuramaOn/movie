'use client';

import { useEffect, useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import AdminLayout from '@/components/AdminLayout';

interface Genre {
  id: number;
  name: string;
  slug: string;
}

export default function GenreManagement() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '' });

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await fetch('/api/admin/genres');
      const data = await response.json();
      setGenres(data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingGenre
        ? `/api/admin/genres/${editingGenre.id}`
        : '/api/admin/genres';
      const method = editingGenre ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(`Genre ${editingGenre ? 'updated' : 'created'} successfully!`);
        setShowModal(false);
        setEditingGenre(null);
        setFormData({ name: '', slug: '' });
        fetchGenres();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving genre:', error);
      alert('Error saving genre');
    }
  };

  const handleEdit = (genre: Genre) => {
    setEditingGenre(genre);
    setFormData({ name: genre.name, slug: genre.slug });
    setShowModal(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const response = await fetch(`/api/admin/genres/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Genre deleted successfully!');
        fetchGenres();
      } else {
        alert('Failed to delete genre');
      }
    } catch (error) {
      console.error('Error deleting genre:', error);
      alert('Error deleting genre');
    }
  };

  const openAddModal = () => {
    setEditingGenre(null);
    setFormData({ name: '', slug: '' });
    setShowModal(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold">Genre Management</h1>
          <button
            onClick={openAddModal}
            className="flex items-center space-x-2 bg-netflix-red hover:bg-red-700 text-white px-6 py-2 rounded transition"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Genre</span>
          </button>
        </div>

        {/* Genres Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-24 bg-netflix-gray rounded skeleton"></div>
            ))}
          </div>
        ) : genres.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {genres.map((genre) => (
              <div
                key={genre.id}
                className="bg-netflix-gray p-6 rounded-lg hover:bg-netflix-light-gray transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{genre.name}</h3>
                    <p className="text-sm text-gray-400">{genre.slug}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(genre)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 rounded transition"
                      title="Edit"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(genre.id, genre.name)}
                      className="p-2 bg-red-600 hover:bg-red-700 rounded transition"
                      title="Delete"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-netflix-gray rounded-lg">
            <p className="text-xl text-gray-400">No genres found</p>
            <button
              onClick={openAddModal}
              className="inline-block mt-4 bg-netflix-red hover:bg-red-700 text-white px-6 py-2 rounded transition"
            >
              Add Your First Genre
            </button>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-netflix-gray rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">
                {editingGenre ? 'Edit Genre' : 'Add Genre'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-netflix-light-gray border border-gray-600 rounded text-white focus:outline-none focus:border-netflix-red"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Slug (leave empty to auto-generate)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-3 bg-netflix-light-gray border border-gray-600 rounded text-white focus:outline-none focus:border-netflix-red"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-netflix-red hover:bg-red-700 text-white font-semibold py-3 rounded transition"
                  >
                    {editingGenre ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingGenre(null);
                      setFormData({ name: '', slug: '' });
                    }}
                    className="px-6 py-3 bg-netflix-light-gray hover:bg-gray-600 text-white rounded transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
