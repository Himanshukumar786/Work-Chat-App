import { StatusCodes } from 'http-status-codes';
import Workspace from '../schema/workspace.js';
import User from '../schema/user.js';
import ClientError from '../utils/errors/clientError.js';
import crudRepository from './crudRepository.js';

const workspaceRepository = {

    ...crudRepository(Workspace),

    getWorkspaceByName: async function (workspaceName) {
        const workspace = await Workspace.findOne({
            name: workspaceName
        })

        if (!workspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from client',
                message: 'Workspace not found',
                statusCode: StatusCodes.NOT_FOUND
            })
        }
        return workspace;
    },

    getWorkspaceByJoinCode: async function (joinCode) {
        const workspace = await Workspace.findOne({
            joinCode
        })

        if (!workspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from client',
                message: 'Workspace not found',
                statusCode: StatusCodes.NOT_FOUND
            })
        }
        return workspace;
    },
    
    addMemberToWorkspace: async function (workspaceId, memeberId, role) {
        const workspace = await Workspace.findById(workspaceId);

        if (!workspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from client',
                message: 'Workspace not found',
                statusCode: StatusCodes.NOT_FOUND
            })
        }

        const isValidUser = await User.findById(memeberId);

        if (!isValidUser) {
            throw new ClientError({
                explanation: 'Invalid data sent from client',
                message: 'User not found',
                statusCode: StatusCodes.NOT_FOUND
            })
        }

        const isMemberAlreadyPartOfWorkspace = workspace.members.find(
            (member) => member.memberId === memeberId
        );

        if (isMemberAlreadyPartOfWorkspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from client',
                message: 'User is already a part of workspace',
                statusCode: StatusCodes.FORBIDDEN
            })
        };

        workspace.members.push({
            memberId: memeberId,
            role
        });

        await workspace.save();

        return workspace;
    },

    addChannelToWorkspace: async function () {},
    fetchAllWorkspaceByMemberId: async function () {}
};

export default workspaceRepository;