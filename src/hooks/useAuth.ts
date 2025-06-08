import { useMutation, useQuery } from '@tanstack/react-query';
import { AuthService } from '../services/auth/auth.service';
import type {
    RegisterRequest,
    ConfirmEmailRequest,
    RequestPasswordResetRequest,
    ResetPasswordRequest
} from '../types/user/User.req.type';
import { useNavigate } from 'react-router-dom';
import { ROUTER_URL } from '../consts/router.path.const';
import { helpers } from '../utils';

/**
 * Hook for user registration
 */
export const useRegister = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (userData: RegisterRequest) => AuthService.register(userData),
        onSuccess: () => {
            helpers.notificationMessage('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.', 'success');
            navigate(ROUTER_URL.AUTH.LOGIN);
        },
        onError: (error: any) => {
            helpers.notificationMessage(error.message || 'Đăng ký thất bại. Vui lòng thử lại.', 'error');
        }
    });
};

/**
 * Hook for email confirmation
 */
export const useConfirmEmail = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (params: ConfirmEmailRequest) => AuthService.confirmEmail(params),
        onSuccess: () => {
            helpers.notificationMessage('Xác nhận email thành công! Bạn có thể đăng nhập ngay bây giờ.', 'success');
            navigate(ROUTER_URL.AUTH.LOGIN);
        },
        onError: (error: any) => {
            helpers.notificationMessage(error.message || 'Xác nhận email thất bại. Vui lòng thử lại.', 'error');
        }
    });
};

/**
 * Hook to verify email token from URL
 */
export const useVerifyEmailToken = (token: string | null) => {
    return useQuery({
        queryKey: ['verifyEmail', token],
        queryFn: () => {
            if (!token) throw new Error('Token không hợp lệ');
            return AuthService.confirmEmail({ token });
        },
        enabled: !!token,
        retry: false,
        staleTime: Infinity
    });
};

/**
 * Hook for requesting password reset
 */
export const useRequestPasswordReset = () => {
    return useMutation({
        mutationFn: (params: RequestPasswordResetRequest) => AuthService.requestPasswordReset(params),
        onSuccess: () => {
            helpers.notificationMessage('Yêu cầu đặt lại mật khẩu đã được gửi đến email của bạn.', 'success');
        },
        onError: (error: any) => {
            helpers.notificationMessage(error.message || 'Yêu cầu đặt lại mật khẩu thất bại. Vui lòng thử lại.', 'error');
        }
    });
};

/**
 * Hook for resetting password
 */
export const useResetPassword = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (params: ResetPasswordRequest) => AuthService.resetPassword(params),
        onSuccess: () => {
            helpers.notificationMessage('Đặt lại mật khẩu thành công! Bạn có thể đăng nhập với mật khẩu mới.', 'success');
            navigate(ROUTER_URL.AUTH.LOGIN);
        },
        onError: (error: any) => {
            helpers.notificationMessage(error.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.', 'error');
        }
    });
}; 