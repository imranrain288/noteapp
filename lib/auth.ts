export interface User {
    id: string;
    username: string;
    passwordHash: string;
}

export class AuthService {
    private users: Map<string, User> = new Map();

    // Register a new user
    register(username: string, password: string): User {
        const id = crypto.randomUUID();
        const passwordHash = this.hashPassword(password);

        if (this.users.has(username)) {
            throw new Error('Username already exists');
        }

        const user: User = { id, username, passwordHash };
        this.users.set(username, user);
        return user;
    }

    // Authenticate a user
    authenticate(username: string, password: string): boolean {
        const user = this.users.get(username);
        if (!user) {
            return false;
        }
        return user.passwordHash === this.hashPassword(password);
    }

    // Hash password (simple example, replace with a secure hashing algorithm)
    private hashPassword(password: string): string {
        return Buffer.from(password).toString('base64'); // Replace with a secure hash in production
    }
}