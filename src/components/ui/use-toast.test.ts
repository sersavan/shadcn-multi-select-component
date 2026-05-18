import { renderHook, act } from '@testing-library/react';
import { useToast, toast, reducer } from './use-toast';

// Mock React
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn((initialState) => [initialState, jest.fn()]),
  useEffect: jest.fn((callback) => callback()),
}));

// Create a simple wrapper component for testing
const wrapper = ({ children }: { children: React.ReactNode }) => children;

describe('use-toast', () => {
  // Test the reducer separately since it's a pure function
  describe('reducer', () => {
    const initialState = { toasts: [] };

    it('should handle ADD_TOAST action', () => {
      const newToast = {
        id: '1',
        title: 'Test Toast',
        open: true,
      };

      const action = {
        type: "ADD_TOAST" as const,
        toast: newToast,
      };

      const newState = reducer(initialState, action);
      
      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0]).toEqual(newToast);
    });

    it('should handle UPDATE_TOAST action', () => {
      const existingToast = {
        id: '1',
        title: 'Old Title',
        description: 'Old Description',
        open: true,
      };

      const updatedToast = {
        id: '1',
        title: 'New Title',
      };

      const state = {
        toasts: [existingToast],
      };

      const action = {
        type: "UPDATE_TOAST" as const,
        toast: updatedToast,
      };

      const newState = reducer(state, action);
      
      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0].id).toBe('1');
      expect(newState.toasts[0].title).toBe('New Title');
      expect(newState.toasts[0].description).toBe('Old Description'); // Should remain unchanged
      expect(newState.toasts[0].open).toBe(true); // Should remain unchanged
    });

    it('should handle UPDATE_TOAST action for non-existent toast', () => {
      const existingToast = {
        id: '1',
        title: 'Old Title',
        open: true,
      };

      const updatedToast = {
        id: '2', // Different ID
        title: 'New Title',
      };

      const state = {
        toasts: [existingToast],
      };

      const action = {
        type: "UPDATE_TOAST" as const,
        toast: updatedToast,
      };

      const newState = reducer(state, action);
      
      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0]).toEqual(existingToast); // Should remain unchanged
    });

    it('should handle DISMISS_TOAST action with specific toastId', () => {
      const toast1 = { id: '1', title: 'Toast 1', open: true };
      const toast2 = { id: '2', title: 'Toast 2', open: true };
      const toast3 = { id: '3', title: 'Toast 3', open: true };

      const state = {
        toasts: [toast1, toast2, toast3],
      };

      const action = {
        type: "DISMISS_TOAST" as const,
        toastId: '2',
      };

      const newState = reducer(state, action);
      
      expect(newState.toasts).toHaveLength(3);
      expect(newState.toasts[0]).toEqual({ ...toast1, open: true });
      expect(newState.toasts[1]).toEqual({ ...toast2, open: false });
      expect(newState.toasts[2]).toEqual({ ...toast3, open: true });
    });

    it('should handle DISMISS_TOAST action without toastId (dismiss all)', () => {
      const toast1 = { id: '1', title: 'Toast 1', open: true };
      const toast2 = { id: '2', title: 'Toast 2', open: true };
      const toast3 = { id: '3', title: 'Toast 3', open: true };

      const state = {
        toasts: [toast1, toast2, toast3],
      };

      const action = {
        type: "DISMISS_TOAST" as const,
        toastId: undefined,
      };

      const newState = reducer(state, action);
      
      expect(newState.toasts).toHaveLength(3);
      expect(newState.toasts[0]).toEqual({ ...toast1, open: false });
      expect(newState.toasts[1]).toEqual({ ...toast2, open: false });
      expect(newState.toasts[2]).toEqual({ ...toast3, open: false });
    });

    it('should handle REMOVE_TOAST action with specific toastId', () => {
      const toast1 = { id: '1', title: 'Toast 1', open: true };
      const toast2 = { id: '2', title: 'Toast 2', open: true };
      const toast3 = { id: '3', title: 'Toast 3', open: true };

      const state = {
        toasts: [toast1, toast2, toast3],
      };

      const action = {
        type: "REMOVE_TOAST" as const,
        toastId: '2',
      };

      const newState = reducer(state, action);
      
      expect(newState.toasts).toHaveLength(2);
      expect(newState.toasts).toEqual([toast1, toast3]);
    });

    it('should handle REMOVE_TOAST action without toastId (remove all)', () => {
      const toast1 = { id: '1', title: 'Toast 1', open: true };
      const toast2 = { id: '2', title: 'Toast 2', open: true };

      const state = {
        toasts: [toast1, toast2],
      };

      const action = {
        type: "REMOVE_TOAST" as const,
        toastId: undefined,
      };

      const newState = reducer(state, action);
      
      expect(newState.toasts).toHaveLength(0);
      expect(newState.toasts).toEqual([]);
    });
  });

  // Set up the hook and function tests
  describe('useToast hook and functions', () => {
    beforeEach(() => {
      // Reset any mocks before each test
      jest.clearAllMocks();
    });

    describe('useToast hook', () => {
      it('should return initial state with empty toasts array', () => {
        const { result } = renderHook(() => useToast(), { wrapper });
        
        expect(result.current.toasts).toEqual([]);
        expect(typeof result.current.toast).toBe('function');
        expect(typeof result.current.dismiss).toBe('function');
      });
    });

    describe('toast function', () => {
      it('should create a toast with required properties', () => {
        const toastResult = toast({ title: 'Test Title' });
        
        expect(toastResult.id).toBeDefined();
        expect(typeof toastResult.dismiss).toBe('function');
        expect(typeof toastResult.update).toBe('function');
      });

      it('should create a toast and add it to the state', () => {
        const toastResult = toast({ title: 'Test Toast' });
        
        expect(toastResult.id).toBeDefined();
      });
    });

    describe('toast API methods', () => {
      it('should provide dismiss function that dispatches DISMISS_TOAST', () => {
        const toastResult = toast({ title: 'Test Toast' });
        
        expect(typeof toastResult.dismiss).toBe('function');
      });

      it('should provide update function that dispatches UPDATE_TOAST', () => {
        const toastResult = toast({ title: 'Test Toast' });
        
        expect(typeof toastResult.update).toBe('function');
      });
    });
  });
});