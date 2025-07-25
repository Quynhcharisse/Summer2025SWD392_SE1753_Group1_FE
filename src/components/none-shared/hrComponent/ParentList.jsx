import React, { useState, useEffect } from 'react';
import { Users, Download, Search, User, Phone, Mail, MapPin, Lock, Unlock, AlertTriangle } from 'lucide-react';
import { hrService } from '@/api/services/hrService';
import LoadingOverlay from '../LoadingOverlay';

const ParentList = () => {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  // Add states for ban/unban functionality
  const [actionLoading, setActionLoading] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchParents();
  }, []);

  const fetchParents = async () => {
    try {
      setLoading(true);
      const data = await hrService.parents.getAllParents();
      setParents(data.data || []);
    } catch (error) {
//       console.error('Error fetching parents:', error);
      // You might want to show a toast notification here
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await hrService.parents.exportParents();
      hrService.downloadFile(blob, `parents-${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
//       console.error('Error exporting parents:', error);
      // You might want to show a toast notification here
    }
  };

  // Add ban/unban functionality
  const showConfirmation = (action, parent) => {
    setPendingAction({ action, parent });
    setShowConfirmDialog(true);
  };

  const executeAction = async () => {
    if (!pendingAction) return;
    
    const { action, parent } = pendingAction;
    setActionLoading(parent.email);
    setError('');
    setSuccess('');
    
    try {
      if (action === 'ban') {
        await hrService.banUser(parent.email);
        setSuccess(`Account locked: ${parent.email}`);
      } else {
        await hrService.unbanUser(parent.email);
        setSuccess(`Account unlocked: ${parent.email}`);
      }
      await fetchParents();
    } catch (err) {
      setError(`Unable to ${action === 'ban' ? 'lock' : 'unlock'} account.`);
    } finally {
      setActionLoading('');
      setShowConfirmDialog(false);
      setPendingAction(null);
    }
  };

  const handleBanParent = (parent) => {
    showConfirmation('ban', parent);
  };

  const handleUnbanParent = (parent) => {
    showConfirmation('unban', parent);
  };

  const filteredParents = parents.filter(parent =>
    parent.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.phone?.includes(searchTerm) ||
    parent.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center">
              <Users className="w-8 h-8 mr-3" />
              Parent Management
            </h1>
            <p className="text-green-100">View and manage parent information</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{parents.length}</p>
            <p className="text-green-100">Total Parents</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded mb-4">
          {success}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search parents by name, phone, email, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Parents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredParents.map((parent) => {
          const isBanned = parent.status === 'ban' || parent.status === 'banned';
          const isActionLoading = actionLoading === parent.email;
          
          return (
            <div key={parent.id} className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow ${
              isBanned ? 'border-l-4 border-red-500' : ''
            }`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      {parent.avatarUrl ? (
                        <img
                          src={parent.avatarUrl}
                          alt={parent.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{parent.name}</h3>
                      <p className="text-sm text-gray-500">{parent.relationship || 'Parent'}</p>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex items-center space-x-1">
                    {isBanned ? (
                      <button
                        onClick={() => handleUnbanParent(parent)}
                        disabled={isActionLoading}
                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Unlock Account"
                      >
                        <Unlock className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBanParent(parent)}
                        disabled={isActionLoading}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Lock Account"
                      >
                        <Lock className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  {parent.email && (
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{parent.email}</span>
                    </div>
                  )}
                  
                  {parent.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{parent.phone}</span>
                    </div>
                  )}
                  
                  {parent.address && (
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span className="text-sm text-gray-600">{parent.address}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Children:</span>
                      <span className="text-sm font-medium">
                        {parent.children?.length || 0}
                      </span>
                    </div>
                    
                    {parent.children && parent.children.length > 0 && (
                      <div className="mt-2">
                        <div className="text-xs text-gray-500 mb-1">Children Names:</div>
                        <div className="flex flex-wrap gap-1">
                          {parent.children.map((child, index) => (
                            <span
                              key={index}
                              className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full"
                            >
                              {child.name || `Child ${index + 1}`}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-gray-500">Status:</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isBanned
                        ? 'bg-red-100 text-red-800' 
                        : parent.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {isBanned ? 'Locked' : (parent.status || 'Active')}
                    </span>
                  </div>
                </div>

                {/* Loading indicator */}
                {isActionLoading && (
                  <div className="mt-3 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-sm text-gray-600">Processing...</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredParents.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No parents found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'No parents match your search criteria.' : 'No parent records available.'}
          </p>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && pendingAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-500 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">
                Confirm {pendingAction.action === 'ban' ? 'Lock' : 'Unlock'} Account
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to {pendingAction.action === 'ban' ? 'lock' : 'unlock'} the account for{' '}
              <strong>{pendingAction.parent.name}</strong> ({pendingAction.parent.email})?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  setPendingAction(null);
                }}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeAction}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  pendingAction.action === 'ban'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {pendingAction.action === 'ban' ? 'Lock Account' : 'Unlock Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentList;
