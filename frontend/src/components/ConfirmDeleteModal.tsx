import React from 'react';

interface Props {
  endpointName: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteModal: React.FC<Props> = ({ endpointName, isDeleting, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={!isDeleting ? onCancel : undefined}
      />

      {/* Modal */}
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">

        {/* Icon + title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20
                          flex items-center justify-center text-lg">
            🗑
          </div>
          <div>
            <h2 className="text-white font-semibold text-base">Delete Endpoint</h2>
            <p className="text-gray-500 text-xs">This action cannot be undone</p>
          </div>
        </div>

        {/* Message */}
        <p className="text-gray-400 text-sm mb-6">
          Are you sure you want to delete{' '}
          <span className="text-white font-medium">"{endpointName}"</span>?
          All health check history will also be removed.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 bg-gray-800 hover:bg-gray-700 disabled:opacity-40
                       text-gray-300 px-4 py-2.5 rounded-lg text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 bg-red-500/20 hover:bg-red-500/30 disabled:opacity-60
                       text-red-400 border border-red-500/30 px-4 py-2.5 rounded-lg
                       text-sm transition-colors flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-red-400/30 border-t-red-400
                                 rounded-full animate-spin inline-block" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
