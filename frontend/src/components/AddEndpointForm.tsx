import React, { useState } from 'react';
import { addEndpointApi } from '../api/endpoints';
import { EndpointResponse } from '../types';

interface Props {
  onAdd: (endpoint: EndpointResponse) => void; // callback to parent
}

const AddEndpointForm: React.FC<Props> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false); // toggle form visibility

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const newEndpoint = await addEndpointApi({ name, url });
      onAdd(newEndpoint);   // tell parent about the new endpoint
      setName('');          // reset form
      setUrl('');
      setIsOpen(false);     // close form
    } catch (err: any) {
      setError(err.response?.data?.url ||
               err.response?.data?.error ||
               'Failed to add endpoint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      {/* Toggle button */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                     text-white px-4 py-2.5 rounded-xl text-sm font-medium
                     transition-colors"
        >
          <span className="text-lg">+</span> Add New Endpoint
        </button>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Add New Endpoint</h3>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400
                            rounded-lg px-4 py-2 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My API"
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white
                             rounded-lg px-4 py-2.5 text-sm placeholder-gray-500
                             focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">
                  URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://api.example.com"
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white
                             rounded-lg px-4 py-2.5 text-sm placeholder-gray-500
                             focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800
                           text-white px-5 py-2.5 rounded-lg text-sm font-medium
                           transition-colors"
              >
                {loading ? 'Adding...' : 'Add Endpoint'}
              </button>

              <button
                type="button"
                onClick={() => { setIsOpen(false); setError(''); }}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300
                           px-5 py-2.5 rounded-lg text-sm font-medium
                           transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddEndpointForm;