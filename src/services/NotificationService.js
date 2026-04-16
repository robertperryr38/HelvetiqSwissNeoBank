export const NotificationService = {
  async requestPermission() {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.log('Notifications not supported');
      return false;
    }

    try {
      if (Notification.permission === 'granted') {
        return true;
      }

      if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
    } catch (error) {
      console.error('Notification permission request failed:', error);
      return false;
    }

    return false;
  },

  sendNotification(title, options = {}) {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return null;
    }

    try {
      if (Notification.permission === 'granted') {
        return new Notification(title, {
          icon: 'card',
          badge: 'card',
          ...options,
        });
      }
    } catch (error) {
      console.error('Notification send failed:', error);
    }

    return null;
  },

  notifyNewMessage(senderName = 'Support') {
    this.sendNotification(`${senderName} sent you a message`, {
      body: 'New message in technical support',
      tag: 'support-message',
    });
  },

  notifyRecipients() {
    this.sendNotification('Payment details received', {
      body: 'New transfer details are now available',
      tag: 'recipients',
    });
  },

  notifyTransactionSuccess(type = 'Transfer') {
    this.sendNotification(`${type} successful`, {
      body: `${type} was completed successfully`,
      tag: 'transaction-success',
    });
  },

  notifyTransactionPending(type = 'Deposit') {
    this.sendNotification(`${type} under review`, {
      body: `${type} was sent for administrator review`,
      tag: 'transaction-pending',
    });
  },

  notifyUserApproved() {
    this.sendNotification('Account activated', {
      body: 'Your account has been approved. Welcome to Helvetiq Bank!',
      tag: 'user-approved',
    });
  },

  notifyUserBlocked() {
    this.sendNotification('Account blocked', {
      body: 'Your account has been blocked. Please contact support.',
      tag: 'user-blocked',
    });
  },

  notifyDepositApproved(amount) {
    this.sendNotification('Deposit approved', {
      body: `A deposit of ${amount} EUR has been approved`,
      tag: 'deposit-approved',
    });
  },

  notifyTransferApproved(recipientName, amount) {
    this.sendNotification('Transfer approved', {
      body: `The EUR ${amount} transfer for ${recipientName} has been approved`,
      tag: 'transfer-approved',
    });
  },
};

export default NotificationService;
